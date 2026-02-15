import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CoursesManagement from './CoursesManagement'

export const metadata = {
  title: 'Quản lý Courses | Admin',
}

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/auth/login')
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null }

  if (profile?.role !== 'admin') {
    redirect('/community')
  }

  // Fetch all courses with category
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      category:categories(id, name, icon),
      instructor:profiles(id, full_name)
    `)
    .order('created_at', { ascending: false })

  // Fetch categories for dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, icon')
    .order('order_index')

  return (
    <CoursesManagement 
      initialCourses={courses || []} 
      categories={categories || []}
      currentUserId={user.id}
    />
  )
}
