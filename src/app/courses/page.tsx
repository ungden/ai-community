import { createClient } from '@/lib/supabase/server'
import CoursesClient from './CoursesClient'

export default async function CoursesPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Service unavailable. Please try again later.</p>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user profile if logged in
  let profile = null
  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = profileData
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  // Fetch courses
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles(full_name, avatar_url),
      category:categories(name, slug)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <CoursesClient
      user={user}
      profile={profile}
      categories={categories || []}
      initialCourses={courses || []}
    />
  )
}
