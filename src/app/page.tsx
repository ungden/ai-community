import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LandingPage from './LandingPage'
import { FALLBACK_POSTS, FALLBACK_TOP_MEMBERS } from '@/lib/fallback-data'

export default async function HomePage() {
  const supabase = await createClient()
  
  if (!supabase) {
    return (
      <LandingPage 
        user={null} 
        memberCount={1247} 
        postCount={892} 
        courseCount={15}
        posts={FALLBACK_POSTS as any}
        topMembers={FALLBACK_TOP_MEMBERS}
        onlineCount={23}
      />
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // User is logged in, redirect to community
    redirect('/community')
  }

  // Fetch stats and preview data for landing page
  const [membersResult, postsResult, coursesResult, recentPosts, topMembersResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    // Fetch 5 most recent/popular posts for preview
    supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        excerpt,
        likes,
        views,
        is_pinned,
        published_at,
        author:profiles(id, full_name, username, role, points)
      `)
      .eq('status', 'published')
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(5),
    // Fetch top members
    supabase
      .from('profiles')
      .select('id, full_name, username, points, role, subscription_tier')
      .order('points', { ascending: false })
      .limit(5)
  ])

  // Calculate realistic online count (2-5% of members)
  const memberCount = membersResult.count || 0
  const onlineCount = memberCount > 0 
    ? Math.max(5, Math.floor(memberCount * (0.02 + Math.random() * 0.03)))
    : 23

  // Use fallback data if DB is empty
  const posts = recentPosts.data && recentPosts.data.length > 0 
    ? recentPosts.data 
    : FALLBACK_POSTS
  
  const topMembers = topMembersResult.data && topMembersResult.data.length > 0
    ? topMembersResult.data
    : FALLBACK_TOP_MEMBERS

  return (
    <LandingPage 
      user={null}
      memberCount={membersResult.count || 1247}
      postCount={postsResult.count || 892}
      courseCount={coursesResult.count || 15}
      posts={posts as any}
      topMembers={topMembers as any}
      onlineCount={onlineCount}
    />
  )
}
