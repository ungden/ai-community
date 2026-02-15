import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import UserProfileClient from './UserProfileClient'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  if (supabase) {
    // Try to find by username first, then by ID
    let profile = null
    const { data: byUsername } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('username', username)
      .single()
    
    if (byUsername) {
      profile = byUsername
    } else {
      const { data: byId } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', username)
        .single()
      profile = byId
    }

    if (profile) {
      return {
        title: `${(profile as { full_name: string | null }).full_name || 'Thành viên'} - Hồ sơ`,
      }
    }
  }

  return { title: 'Hồ sơ thành viên' }
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  // Try to find by username first, then by ID
  let profile = null
  const { data: byUsername } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  
  if (byUsername) {
    profile = byUsername
  } else {
    const { data: byId } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', username)
      .single()
    profile = byId
  }

  if (!profile) {
    notFound()
  }

  const profileId = (profile as { id: string }).id

  // Fetch user badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select(`
      badge_id,
      earned_at,
      badge:badges(*)
    `)
    .eq('user_id', profileId)

  // Fetch recent posts by this user
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, views, likes, published_at')
    .eq('author_id', profileId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5)

  // Check if current visitor is the profile owner
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const isOwnProfile = currentUser?.id === profileId

  return (
    <UserProfileClient
      profile={profile as never}
      badges={(userBadges as never[]) || []}
      recentPosts={(recentPosts as never[]) || []}
      isOwnProfile={isOwnProfile}
    />
  )
}
