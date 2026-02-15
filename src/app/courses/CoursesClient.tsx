'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Brain,
  Search,
  Sun,
  Moon,
  Clock,
  BookOpen,
  Users,
  Zap,
  Lock,
  Play,
  Crown,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { vi } from '@/lib/translations'
import type { User } from '@supabase/supabase-js'
import type { Profile, Category, CourseWithInstructor } from '@/lib/database.types'

interface CoursesClientProps {
  user: User | null
  profile: Profile | null
  categories: Category[]
  initialCourses: CourseWithInstructor[]
}

export default function CoursesClient({ user, profile, categories, initialCourses }: CoursesClientProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [courses] = useState(initialCourses)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = courses.filter(course => {
    if (selectedCategory && course.category_id !== selectedCategory) return false
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const canAccessCourse = (course: CourseWithInstructor) => {
    if (course.required_tier === 'free') return true
    if (!profile) return false
    const tierHierarchy = { free: 0, basic: 1, premium: 2 }
    return tierHierarchy[profile.subscription_tier] >= tierHierarchy[course.required_tier]
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins} phut`
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href={user ? '/community' : '/'}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[var(--text-primary)] hidden sm:block">
                  AI Community
                </span>
              </Link>
            </div>

            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full pl-12 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-[var(--bg-secondary)]"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </button>
              {user ? (
                <Link
                  href="/community"
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
                >
                  {vi.nav.feed}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
                  >
                    {vi.auth.login}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium"
                  >
                    {vi.auth.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {vi.courses.title}
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Học cách áp dụng AI vào công việc thực tế với các khóa học có cấu trúc
          </p>

          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm khóa học..."
                className="w-full pl-12 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {vi.categories.all}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-12 text-center border border-[var(--border-light)]">
              <BookOpen className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">{vi.courses.noCoursesFound}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, idx) => {
                const hasAccess = canAccessCourse(course)
                
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={hasAccess ? `/courses/${course.slug}` : '/pricing'}
                      className="block bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-light)] hover:shadow-xl transition-all group"
                    >
                      <div className="relative h-48 bg-[var(--bg-tertiary)]">
                        {course.cover_image ? (
                          <Image
                            src={course.cover_image}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-[var(--text-tertiary)]" />
                          </div>
                        )}
                        
                        {!hasAccess && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center text-white">
                              <Lock className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-medium">Khóa học {course.required_tier.toUpperCase()}</p>
                            </div>
                          </div>
                        )}

                        {course.required_tier !== 'free' && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-md flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {course.required_tier.toUpperCase()}
                          </div>
                        )}

                        {hasAccess && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="w-6 h-6 text-blue-500 ml-1" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        {course.category && (
                          <div className="text-sm text-blue-500 font-medium mb-2">
                            {course.category.name}
                          </div>
                        )}
                        
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                          {course.title}
                        </h3>

                        {course.description && (
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                            {course.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                            {course.instructor?.full_name?.charAt(0) || 'A'}
                          </div>
                          <span className="text-sm text-[var(--text-secondary)]">
                            {course.instructor?.full_name || 'Admin'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-[var(--text-tertiary)]">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {course.lessons_count} {vi.courses.lessons}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDuration(course.duration_minutes)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Upgrade CTA */}
          {profile?.subscription_tier === 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center"
            >
              <Crown className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl font-bold mb-2">Mở khóa tất cả khóa học</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Nâng cấp lên Basic hoặc Premium để truy cập tất cả khóa học và nội dung độc quyền.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Xem bảng giá
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
