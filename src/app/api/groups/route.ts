import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get groups with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const db = supabase as any
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const privacy = searchParams.get('privacy')
    const is_featured = searchParams.get('is_featured')
    const offset = (page - 1) * limit

    let query = db
      .from('groups')
      .select(`
        *,
        owner:profiles!owner_id(*)
      `, { count: 'exact' })
      .order('member_count', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (privacy === 'public' || privacy === 'private') {
      query = query.eq('privacy', privacy)
    }

    if (is_featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data: groups, error, count } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
    }

    return NextResponse.json({
      groups,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a new group (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = supabase as any

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || (profile as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, about, cover_image, icon_emoji, color, privacy, required_tier } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    // Check if slug already exists
    const { data: existing } = await db
      .from('groups')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'A group with a similar name already exists' }, { status: 409 })
    }

    const groupData = {
      name: name.trim(),
      slug,
      description: description || null,
      about: about || null,
      cover_image: cover_image || null,
      icon_emoji: icon_emoji || '🚀',
      color: color || '#1877f2',
      privacy: privacy || 'public',
      owner_id: user.id,
      required_tier: required_tier || 'free',
    }

    const { data: group, error } = await db
      .from('groups')
      .insert(groupData)
      .select(`
        *,
        owner:profiles!owner_id(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
    }

    // Auto-add the creator as owner member
    await db
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'owner',
      })

    return NextResponse.json({ group }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
