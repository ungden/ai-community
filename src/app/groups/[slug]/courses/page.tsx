import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FALLBACK_GROUPS } from '@/lib/fallback-data'
import GroupCoursesClient from './GroupCoursesClient'

export default async function GroupCoursesPage({ params }: { params: Promise<{ slug: string }> }) {
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

  // Fetch courses for this group
  const { data: dbCourses } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles(full_name, avatar_url),
      category:categories(name, slug)
    `)
    .eq('status', 'published')
    .eq('group_id', group.id!)
    .order('created_at', { ascending: false })

  // Use fallback if empty
  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : []

  return (
    <GroupCoursesClient
      profile={profile}
      courses={courses}
      groupName={group.name!}
    />
  )
}
