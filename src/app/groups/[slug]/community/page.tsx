import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FALLBACK_GROUPS, FALLBACK_CATEGORIES } from '@/lib/fallback-data'
import GroupCommunityClient from './GroupCommunityClient'

export default async function GroupCommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
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

  // Fetch group
  const { data: dbGroup } = await supabase
    .from('groups')
    .select('*')
    .eq('slug', slug)
    .single()

  const fallbackGroup = FALLBACK_GROUPS.find(g => g.slug === slug)
  const group = dbGroup || fallbackGroup

  if (!group) {
    redirect('/groups')
  }

  // Fetch categories
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  // Fetch posts for this group
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(*),
      category:categories(*)
    `)
    .eq('status', 'published')
    .eq('group_id', group.id!)
    .order('published_at', { ascending: false })
    .limit(20)

  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES

  return (
    <GroupCommunityClient
      profile={profile}
      categories={categories}
      initialPosts={posts || []}
      groupId={group.id!}
      groupName={group.name!}
    />
  )
}
