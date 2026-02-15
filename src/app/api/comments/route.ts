import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const searchParams = request.nextUrl.searchParams
    const post_id = searchParams.get('post_id')

    if (!post_id) {
      return NextResponse.json({ error: 'post_id is required' }, { status: 400 })
    }

    // Get all comments for this post
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles(id, full_name, avatar_url, points)
      `)
      .eq('post_id', post_id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    // Organize comments into nested structure
    const commentMap = new Map()
    const rootComments: any[] = []

    ;(comments as any[])?.forEach((comment: any) => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    ;(comments as any[])?.forEach((comment: any) => {
      const commentWithReplies = commentMap.get(comment.id)
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies.push(commentWithReplies)
        }
      } else {
        rootComments.push(commentWithReplies)
      }
    })

    return NextResponse.json({ comments: rootComments })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a new comment
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
    const { post_id, content, parent_id } = body

    if (!post_id || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'post_id and content are required' }, { status: 400 })
    }

    const commentData = {
      post_id,
      user_id: user.id,
      content: content.trim(),
      parent_id: parent_id || null
    }

    const { data: comment, error } = await (supabase as any)
      .from('comments')
      .insert(commentData)
      .select(`
        *,
        author:profiles(id, full_name, avatar_url, points)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const comment_id = searchParams.get('id')

    if (!comment_id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }

    // Verify user owns the comment
    const { data: existingComment } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', comment_id)
      .single()

    if (!existingComment || (existingComment as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', comment_id)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
