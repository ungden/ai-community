import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClassroomClient from './ClassroomClient'
import { FALLBACK_CATEGORIES, FALLBACK_COURSES } from '@/lib/fallback-data'

export const metadata = {
  title: 'Lớp học | Alex Le AI',
  description: 'Khóa học AI thực chiến: ChatGPT, Claude, Midjourney, Make, Automation. Học từ case study thực tế.',
}

export default async function ClassroomPage() {
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

  // Fetch courses
  const { data: dbCourses } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles(full_name, avatar_url),
      category:categories(name, slug)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  // Use fallback data if DB is empty
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES
  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : FALLBACK_COURSES as any

  return (
    <ClassroomClient
      user={user}
      profile={profile}
      categories={categories}
      initialCourses={courses}
    />
  )
}
