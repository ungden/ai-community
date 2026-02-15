import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CommunityClient from './CommunityClient'
import { FALLBACK_CATEGORIES, FALLBACK_TOP_MEMBERS } from '@/lib/fallback-data'

export const metadata = {
  title: 'Cộng đồng | Alex Le AI',
  description: 'Tham gia cộng đồng Alex Le AI - nơi chia sẻ kinh nghiệm sử dụng AI trong công việc thực tế.',
}

export default async function CommunityPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/auth/login')
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch categories
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  // Fetch recent posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(*),
      category:categories(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  // Fetch top members for sidebar
  const { data: dbTopMembers } = await supabase
    .from('profiles')
    .select('*')
    .order('points', { ascending: false })
    .limit(5)

  // Get member count
  const { count: memberCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Use fallback data if DB is empty
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES
  const topMembers = dbTopMembers && dbTopMembers.length > 0 ? dbTopMembers : FALLBACK_TOP_MEMBERS as any

  return (
    <CommunityClient 
      user={user}
      profile={profile}
      categories={categories}
      initialPosts={posts || []}
      topMembers={topMembers}
      memberCount={memberCount || 1247}
    />
  )
}
