import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GroupsClient from './GroupsClient'
import { FALLBACK_GROUPS } from '@/lib/fallback-data'

export const metadata = {
  title: 'Khám phá Nhóm | Alex Le AI',
  description: 'Khám phá và tham gia các nhóm cộng đồng Alex Le AI - nơi chia sẻ kinh nghiệm sử dụng AI trong công việc thực tế.',
}

export default async function GroupsPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/auth/login')
  }

  const db = supabase as any

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

  // Fetch groups
  const { data: dbGroups } = await db
    .from('groups')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('member_count', { ascending: false })

  // Fetch groups user is member of
  const { data: dbUserGroupMembers } = await db
    .from('group_members')
    .select('group_id')
    .eq('user_id', user.id)

  // Get member count
  const { count: memberCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Use fallback data if DB is empty
  const groups = dbGroups && dbGroups.length > 0 ? dbGroups : FALLBACK_GROUPS as any
  const userGroupIds = dbUserGroupMembers?.map((m: any) => m.group_id) || []

  return (
    <GroupsClient 
      user={user}
      profile={profile}
      groups={groups}
      userGroupIds={userGroupIds}
      memberCount={memberCount || 1247}
    />
  )
}
