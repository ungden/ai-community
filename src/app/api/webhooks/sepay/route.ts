import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

// Sepay webhook payload interface
interface SepayWebhookPayload {
  id: number
  gateway: string
  transactionDate: string
  accountNumber: string
  code: string | null
  content: string
  transferType: string
  description: string
  transferAmount: number
  referenceCode: string
  accumulated: number
  subAccount: string | null
}

function verifySignature(signature: string | null, body: string): boolean {
  const secret = process.env.SEPAY_WEBHOOK_SECRET
  if (!secret) {
    // If no secret configured, skip verification (dev mode)
    console.warn('SEPAY_WEBHOOK_SECRET not set — skipping signature verification')
    return true
  }
  if (!signature) return false
  const expectedSignature = createHmac('sha256', secret).update(body).digest('hex')
  return signature === expectedSignature
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    
    // Verify webhook signature
    const signature = request.headers.get('x-sepay-signature')
    if (!verifySignature(signature, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload: SepayWebhookPayload = JSON.parse(rawBody)

    // Extract payment reference from content
    // The content should contain the payment reference code (e.g., "AI1234567890ABC")
    const content = payload.content || payload.description || ''
    const paymentRefMatch = content.match(/AI[A-Z0-9]+/i)
    
    if (!paymentRefMatch) {
      return NextResponse.json({ 
        success: false, 
        message: 'No payment reference found' 
      })
    }

    const paymentRef = paymentRefMatch[0].toUpperCase()

    const supabase = await createServiceClient()

    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        message: 'Service unavailable' 
      }, { status: 503 })
    }

    // Find pending subscription with this payment reference
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('payment_ref', paymentRef)
      .eq('status', 'pending')
      .single() as { data: { id: string; price: number; user_id: string; tier: string } | null; error: Error | null }

    if (fetchError || !subscription) {
      return NextResponse.json({ 
        success: false, 
        message: 'No pending subscription found' 
      })
    }

    // Verify amount (allow some tolerance for bank fees)
    const expectedAmount = subscription.price
    const receivedAmount = payload.transferAmount

    if (receivedAmount < expectedAmount * 0.99) { // Allow 1% tolerance
      return NextResponse.json({ 
        success: false, 
        message: 'Amount mismatch' 
      })
    }

    // Calculate subscription dates
    const startsAt = new Date()
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month subscription

    // Update subscription to active
    const { error: updateSubError } = await (supabase as any)
      .from('subscriptions')
      .update({
        status: 'active',
        starts_at: startsAt.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', subscription.id)

    if (updateSubError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Error updating subscription' 
      }, { status: 500 })
    }

    // Create payment record
    const { error: paymentError } = await (supabase as any)
      .from('payments')
      .insert({
        subscription_id: subscription.id,
        user_id: subscription.user_id,
        amount: receivedAmount,
        status: 'completed',
        sepay_transaction_id: payload.id.toString(),
        paid_at: new Date().toISOString(),
      })

    if (paymentError) {
      // Payment record creation failed but subscription is already active
    }

    // Update user profile subscription tier
    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .update({
        subscription_tier: subscription.tier,
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', subscription.user_id)

    if (profileError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Error updating profile' 
      }, { status: 500 })
    }

    // Award badge for first subscription (simplified)
    try {
      const { data: subscriberBadge } = await supabase
        .from('badges')
        .select('id')
        .eq('name', 'Fan cứng')
        .single() as { data: { id: string } | null }

      if (subscriberBadge) {
        await (supabase as any)
          .from('user_badges')
          .insert({
            user_id: subscription.user_id,
            badge_id: subscriberBadge.id,
          })
      }
    } catch {
      // Badge award is optional, don't fail the payment
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully' 
    })

  } catch {
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}

// Health check for webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Sepay webhook endpoint is active' 
  })
}
