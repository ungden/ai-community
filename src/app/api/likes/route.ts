import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Toggle like on a post or comment
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

    const body = await request.json()
    const { type, id } = body // type: 'post' | 'comment', id: post_id or comment_id

    if (!type || !id) {
      return NextResponse.json({ error: 'type and id are required' }, { status: 400 })
    }

    const tableName = type === 'post' ? 'post_likes' : 'comment_likes'
    const idColumn = type === 'post' ? 'post_id' : 'comment_id'

    // Check if already liked
    const { data: existingLike } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .eq(idColumn, id)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('user_id', user.id)
        .eq(idColumn, id)

      if (error) {
        return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 })
      }

      return NextResponse.json({ liked: false })
    } else {
      // Like
      const likeData = {
        user_id: user.id,
        [idColumn]: id
      }

      const { error } = await (supabase as any)
        .from(tableName)
        .insert(likeData)

      if (error) {
        return NextResponse.json({ error: 'Failed to add like' }, { status: 500 })
      }

      return NextResponse.json({ liked: true })
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Check if user has liked a post or comment
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ liked: false })
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json({ error: 'type and id are required' }, { status: 400 })
    }

    const tableName = type === 'post' ? 'post_likes' : 'comment_likes'
    const idColumn = type === 'post' ? 'post_id' : 'comment_id'

    const { data: existingLike } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .eq(idColumn, id)
      .single()

    return NextResponse.json({ liked: !!existingLike })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
