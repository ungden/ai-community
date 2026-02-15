import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const plan = searchParams.get('plan')
  const next = searchParams.get('next') ?? '/community'

  if (code) {
    const supabase = await createClient()
    
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        // If user selected a paid plan, redirect to pricing
        if (plan && plan !== 'free') {
          return NextResponse.redirect(`${origin}/pricing?plan=${plan}`)
        }
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
