import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get posts in a group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const db = supabase as any
    const { slug } = await params

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get the group by slug
    const { data: group, error: groupError } = await db
      .from('groups')
      .select('id')
      .eq('slug', slug)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Get posts filtered by group_id
    const { data: posts, error, count } = await db
      .from('posts')
      .select(`
        *,
        author:profiles(*),
        category:categories(*)
      `, { count: 'exact' })
      .eq('group_id', group.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({
      posts,
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

// Create a post in a group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const db = supabase as any

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    // Get the group by slug
    const { data: group, error: groupError } = await db
      .from('groups')
      .select('id')
      .eq('slug', slug)
      .single()

    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Verify user is a member of the group
    const { data: membership } = await db
      .from('group_members')
      .select('user_id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'You must be a member of this group to post' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, category_id } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Generate a slug from title or content
    const slugBase = title || content.substring(0, 50)
    const postSlug = slugBase
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + Date.now()

    const postData = {
      title: title || content.substring(0, 100),
      slug: postSlug,
      content,
      excerpt: content.substring(0, 200),
      author_id: user.id,
      group_id: group.id,
      category_id: category_id || null,
      status: 'published' as const,
      published_at: new Date().toISOString(),
      required_tier: 'free' as const,
    }

    const { data: post, error } = await db
      .from('posts')
      .insert(postData)
      .select(`
        *,
        author:profiles(*),
        category:categories(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    // Increment post_count on the group
    await db.rpc('increment_group_post_count', { group_id_input: group.id })

    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
