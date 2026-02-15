import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Create a new post (community post, not admin article)
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { title, content, category_id } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Generate a slug from title or content
    const slugBase = title || content.substring(0, 50)
    const slug = slugBase
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + Date.now()

    const postData = {
      title: title || content.substring(0, 100),
      slug,
      content,
      excerpt: content.substring(0, 200),
      author_id: user.id,
      category_id: category_id || null,
      status: 'published',
      published_at: new Date().toISOString(),
      required_tier: 'free'
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

    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get posts with pagination
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
    const category_id = searchParams.get('category_id')
    const offset = (page - 1) * limit

    let query = db
      .from('posts')
      .select(`
        *,
        author:profiles(*),
        category:categories(*)
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category_id) {
      query = query.eq('category_id', category_id)
    }

    const { data: posts, error, count } = await query

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
