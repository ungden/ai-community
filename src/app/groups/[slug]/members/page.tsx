import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FALLBACK_GROUPS, FALLBACK_TOP_MEMBERS } from '@/lib/fallback-data'
import GroupMembersClient from './GroupMembersClient'

export default async function GroupMembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  if (!supabase) {
    redirect('/auth/login')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

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

  // Fetch group members with profiles
  const { data: dbMembers } = await supabase
    .from('group_members')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('group_id', group.id!)
    .order('points_in_group', { ascending: false })

  const members = dbMembers && dbMembers.length > 0
    ? dbMembers.map((m: any) => ({
        ...m.profile,
        points_in_group: m.points_in_group,
        group_role: m.role,
        joined_at: m.joined_at,
      }))
    : FALLBACK_TOP_MEMBERS.map((m, idx) => ({
        ...m,
        points_in_group: m.points,
        group_role: idx === 0 ? 'owner' : 'member',
        joined_at: new Date(Date.now() - (idx + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      })) as any[]

  return (
    <GroupMembersClient
      members={members}
      currentUserId={user.id}
      groupName={group.name!}
    />
  )
}
