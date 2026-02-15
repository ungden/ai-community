import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FALLBACK_GROUPS, FALLBACK_TOP_MEMBERS } from '@/lib/fallback-data'
import GroupLeaderboardsClient from './GroupLeaderboardsClient'

export default async function GroupLeaderboardsPage({ params }: { params: Promise<{ slug: string }> }) {
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

  // Fetch group members sorted by points_in_group
  const { data: dbMembers } = await supabase
    .from('group_members')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('group_id', group.id!)
    .order('points_in_group', { ascending: false })
    .limit(100)

  const fallbackMembers = FALLBACK_TOP_MEMBERS.map((m, idx) => ({
    ...m,
    points_in_group: m.points,
    group_role: idx === 0 ? 'owner' : 'member',
  })) as any[]

  let members = dbMembers && dbMembers.length > 0
    ? dbMembers.map((m: any) => ({
        ...m.profile,
        points_in_group: m.points_in_group,
        group_role: m.role,
      }))
    : fallbackMembers

  // Make sure current user is in list
  if (profile) {
    const profileInList = members.find((m: any) => m.id === (profile as any).id)
    if (!profileInList) {
      members = [...members, { ...(profile as any), points_in_group: 0, group_role: 'member' }]
    }
  }

  // Get user's rank
  let userRank = members.findIndex((m: any) => m.id === user.id) + 1
  if (userRank === 0) userRank = members.length + 1

  return (
    <GroupLeaderboardsClient
      currentUserId={user.id}
      profile={profile}
      members={members}
      userRank={userRank}
      groupName={group.name!}
    />
  )
}
