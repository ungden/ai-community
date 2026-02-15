import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get a single group by slug with owner profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { slug } = await params
    const db = supabase as any

    const { data: group, error } = await db
      .from('groups')
      .select(`
        *,
        owner:profiles!owner_id(*)
      `)
      .eq('slug', slug)
      .single()

    if (error || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Optionally check if the current user is a member
    let is_member = false
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: membership } = await db
        .from('group_members')
        .select('user_id')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single()

      is_member = !!membership
    }

    return NextResponse.json({ group, is_member })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
