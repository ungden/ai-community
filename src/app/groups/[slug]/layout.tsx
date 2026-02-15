import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FALLBACK_GROUPS, FALLBACK_TOP_MEMBERS } from '@/lib/fallback-data'
import GroupLayout from './GroupLayout'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  let groupName = slug
  if (supabase) {
    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('slug', slug)
      .single()
    if (group) groupName = (group as any).name
  }
  
  if (groupName === slug) {
    const fallback = FALLBACK_GROUPS.find(g => g.slug === slug)
    if (fallback?.name) groupName = fallback.name
  }

  return {
    title: `${groupName} | Alex Le AI`,
    description: `Tham gia nhóm ${groupName} trên Alex Le AI.`,
  }
}

export default async function GroupDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
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

  // Fetch group by slug
  const { data: dbGroup } = await supabase
    .from('groups')
    .select('*')
    .eq('slug', slug)
    .single()

  // Use fallback if DB group not found
  const fallbackGroup = FALLBACK_GROUPS.find(g => g.slug === slug)
  const group = dbGroup || fallbackGroup

  if (!group) {
    redirect('/groups')
  }

  // Check membership
  const { data: membership } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', group.id!)
    .eq('user_id', user.id)
    .single()

  const isMember = !!membership

  // Fetch top members in group
  const { data: dbTopMembers } = await supabase
    .from('group_members')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('group_id', group.id!)
    .order('points_in_group', { ascending: false })
    .limit(5)

  const topMembers = dbTopMembers && dbTopMembers.length > 0
    ? dbTopMembers.map((m: any) => ({
        ...m.profile,
        points_in_group: m.points_in_group,
        group_role: m.role,
        joined_at: m.joined_at,
      }))
    : FALLBACK_TOP_MEMBERS as any[]

  return (
    <GroupLayout
      profile={profile}
      group={group as any}
      isMember={isMember}
      topMembers={topMembers}
      slug={slug}
    >
      {children}
    </GroupLayout>
  )
}
