import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { SubscriptionTier } from '@/lib/database.types'

const TIER_LEVELS: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  premium: 2,
}

// Join a group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const db = supabase as any

    // Get the group
    const { data: group, error: groupError } = await db
      .from('groups')
      .select('id, required_tier, privacy')
      .eq('slug', slug)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Check subscription tier requirement
    const { data: profile, error: profileError } = await db
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const userTierLevel = TIER_LEVELS[profile.subscription_tier as SubscriptionTier] ?? 0
    const requiredTierLevel = TIER_LEVELS[group.required_tier as SubscriptionTier] ?? 0

    if (userTierLevel < requiredTierLevel) {
      return NextResponse.json(
        { error: `This group requires a ${group.required_tier} subscription or higher` },
        { status: 403 }
      )
    }

    // Check if already a member
    const { data: existing } = await db
      .from('group_members')
      .select('user_id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already a member of this group' }, { status: 409 })
    }

    // Join the group
    const { error: joinError } = await db
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'member',
      })

    if (joinError) {
      return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Successfully joined group' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Leave a group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const db = supabase as any

    // Get the group
    const { data: group, error: groupError } = await db
      .from('groups')
      .select('id, owner_id')
      .eq('slug', slug)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Owners cannot leave their own group
    if (group.owner_id === user.id) {
      return NextResponse.json({ error: 'Group owners cannot leave their own group' }, { status: 400 })
    }

    // Delete membership
    const { error: deleteError } = await db
      .from('group_members')
      .delete()
      .eq('group_id', group.id)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Successfully left group' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
