import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CourseDetailClient from './CourseDetailClient'
import { FALLBACK_COURSES } from '@/lib/fallback-data'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  if (supabase) {
    const { data: course } = await supabase
      .from('courses')
      .select('title, description')
      .eq('slug', slug)
      .single()

    if (course) {
      return {
        title: (course as { title: string }).title,
        description: (course as { description: string | null }).description || undefined,
      }
    }
  }

  const fallback = FALLBACK_COURSES.find(c => c.slug === slug)
  if (fallback) {
    return { title: fallback.title, description: fallback.description || undefined }
  }

  return { title: 'Khóa học' }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  let user = null
  let profile = null
  let course = null
  let lessons: Array<{ id: string; title: string; order_index: number; duration_minutes: number }> = []

  if (supabase) {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser

    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = profileData
    }

    const { data: courseData } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles(id, full_name, avatar_url, bio),
        category:categories(name, slug)
      `)
      .eq('slug', slug)
      .single()

    if (courseData) {
      course = courseData

      // Fetch lessons for this course
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id, title, order_index, duration_minutes')
        .eq('course_id', (courseData as { id: string }).id)
        .order('order_index')

      lessons = (lessonsData as typeof lessons) || []
    }
  }

  // Fallback to static data if no course found
  if (!course) {
    const fallbackCourse = FALLBACK_COURSES.find(c => c.slug === slug)
    if (!fallbackCourse) {
      notFound()
    }
    course = {
      ...fallbackCourse,
      instructor_id: '1',
      cover_image: null,
      instructor: { id: '1', full_name: 'Alex Le', avatar_url: null, bio: 'Founder & Admin' },
      category: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    }
    // Generate sample lessons for fallback
    const count = fallbackCourse.lessons_count || 5
    lessons = Array.from({ length: count }, (_, i) => ({
      id: `lesson-${i + 1}`,
      title: `Bài ${i + 1}: ${i === 0 ? 'Giới thiệu' : i === count - 1 ? 'Tổng kết & bài tập' : `Nội dung phần ${i + 1}`}`,
      order_index: i + 1,
      duration_minutes: Math.floor(Math.random() * 15) + 5,
    }))
  }

  return (
    <CourseDetailClient
      course={course as never}
      lessons={lessons}
      user={user}
      profile={profile as never}
    />
  )
}
