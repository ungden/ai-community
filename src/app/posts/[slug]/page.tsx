import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import PostDetailClient from './PostDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  
  if (!supabase) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch post
  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: { id: string; slug: string; title: string; content: string; excerpt: string | null; cover_image: string | null; required_tier: string; views: number; likes: number; category_id: string | null; published_at: string | null; author: Record<string, unknown> | null; category: Record<string, unknown> | null } | null }

  if (!post) {
    notFound()
  }

  // Fetch user profile if logged in
  let profile = null
  let hasLiked = false
  
  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = profileData

    // Check if user has liked this post
    const { data: likeData } = await supabase
      .from('post_likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', post.id)
      .single()
    hasLiked = !!likeData
  }

  // Check access
  const canAccess = () => {
    if (post.required_tier === 'free') return true
    if (!profile) return false
    const tierHierarchy: Record<string, number> = { free: 0, basic: 1, premium: 2 }
    const userTier = (profile as { subscription_tier?: string })?.subscription_tier || 'free'
    return (tierHierarchy[userTier] || 0) >= (tierHierarchy[post.required_tier] || 0)
  }

  // Increment views
  await supabase
    .from('posts')
    .update({ views: post.views + 1 } as never)
    .eq('id', post.id)

  // Fetch related posts
  let relatedPosts: unknown[] = []
  if (post.category_id) {
    const { data } = await supabase
      .from('posts')
      .select(`
        id, title, slug, excerpt, cover_image, required_tier, views,
        category:categories(name)
      `)
      .eq('status', 'published')
      .eq('category_id', post.category_id)
      .neq('id', post.id)
      .limit(3)
    relatedPosts = data || []
  }

  return (
    <PostDetailClient
      post={post as never}
      user={user}
      profile={profile as never}
      canAccess={canAccess()}
      hasLiked={hasLiked}
      relatedPosts={relatedPosts as never[]}
    />
  )
}
