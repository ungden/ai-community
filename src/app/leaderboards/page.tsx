import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LeaderboardsClient from './LeaderboardsClient'
import { FALLBACK_TOP_MEMBERS } from '@/lib/fallback-data'

export const metadata = {
  title: 'Bảng xếp hạng | Alex Le AI',
  description: 'Bảng xếp hạng thành viên tích cực nhất trong cộng đồng Alex Le AI.',
}

export default async function LeaderboardsPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/auth/login')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  const profile = profileData as any

  // Fetch all members sorted by points
  const { data: dbMembers } = await supabase
    .from('profiles')
    .select('*')
    .order('points', { ascending: false })
    .limit(100)

  // Use fallback if DB is empty or only has current user
  const fallbackMembers = FALLBACK_TOP_MEMBERS as any[]
  let members: any[] = dbMembers && dbMembers.length > 1 ? dbMembers : fallbackMembers
  
  // If user exists in DB, make sure they're in the list
  if (profile) {
    const profileInList = members.find((m: any) => m.id === profile.id)
    if (!profileInList) {
      members = [...members, profile]
    }
  }

  // Get user's rank
  let userRank = members.findIndex((p: any) => p.id === user.id) + 1
  if (userRank === 0) userRank = members.length + 1

  return (
    <LeaderboardsClient
      user={user}
      profile={profile}
      members={members}
      userRank={userRank}
    />
  )
}
