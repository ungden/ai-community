import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
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

  // Fetch user badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select(`
      badge_id,
      earned_at,
      badge:badges(*)
    `)
    .eq('user_id', user.id)

  // Fetch user subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)

  return (
    <ProfileClient
      user={user}
      profile={profile as never}
      badges={(userBadges as never[]) || []}
      activeSubscription={subscriptions?.[0] as never || null}
    />
  )
}
