'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Play,
  Lock,
  Crown,
  CheckCircle,
  Zap,
  Sun,
  Moon,
  Brain,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import type { User } from '@supabase/supabase-js'
import type { Profile, CourseWithInstructor, SubscriptionTier } from '@/lib/database.types'
import { getUserLevel, getLevelName } from '@/lib/gamification'

interface CourseDetailClientProps {
  course: CourseWithInstructor
  lessons: Array<{ id: string; title: string; order_index: number; duration_minutes: number }>
  user: User | null
  profile: Profile | null
}

const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Miễn phí',
  basic: 'Basic',
  premium: 'Premium',
}

const TIER_ORDER: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  premium: 2,
}

export default function CourseDetailClient({ course, lessons, user, profile }: CourseDetailClientProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const userTier = profile?.subscription_tier || 'free'
  const canAccess = TIER_ORDER[userTier as SubscriptionTier] >= TIER_ORDER[course.required_tier]

  const totalDuration = lessons.reduce((sum, l) => sum + l.duration_minutes, 0)
  const hours = Math.floor(totalDuration / 60)
  const minutes = totalDuration % 60

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Cover Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-2xl overflow-hidden mb-6 bg-[var(--bg-secondary)] aspect-video"
              >
                {course.cover_image ? (
                  <Image
                    src={course.cover_image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                    <BookOpen className="w-16 h-16 text-[var(--text-tertiary)]" />
                  </div>
                )}
                {course.required_tier !== 'free' && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium rounded-lg flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {TIER_LABELS[course.required_tier]}
                  </div>
                )}
              </motion.div>

              {/* Title & Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {course.category && (
                  <span className="text-sm font-medium text-blue-500 mb-2 block">
                    {(course.category as { name: string }).name}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-6">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons_count} bài học</span>
                  </div>
                  <span className="text-[var(--text-tertiary)]">·</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{hours > 0 ? `${hours}h ${minutes}m` : `${minutes} phút`}</span>
                  </div>
                  {course.required_level > 1 && (
                    <>
                      <span className="text-[var(--text-tertiary)]">·</span>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4" />
                        <span>Level {course.required_level}+</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Lessons List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                  Nội dung khóa học
                </h2>
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)]"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        canAccess
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                      }`}>
                        {canAccess ? (
                          <Play className="w-4 h-4" />
                        ) : idx === 0 ? (
                          <Play className="w-4 h-4" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">
                          {lesson.title}
                        </p>
                      </div>
                      <span className="text-sm text-[var(--text-tertiary)] flex-shrink-0">
                        {lesson.duration_minutes} phút
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="sticky top-24 space-y-6"
              >
                {/* Action Card */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                  {canAccess ? (
                    <>
                      <div className="flex items-center gap-2 text-green-500 mb-4">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Bạn đã có quyền truy cập</span>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <Play className="w-5 h-5" />
                        Bắt đầu học
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-yellow-500 mb-3">
                        <Lock className="w-5 h-5" />
                        <span className="font-medium">
                          Yêu cầu gói {TIER_LABELS[course.required_tier]}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-4">
                        Nâng cấp tài khoản để truy cập khóa học này và tất cả nội dung {TIER_LABELS[course.required_tier]}.
                      </p>
                      {!user ? (
                        <div className="space-y-2">
                          <Link
                            href="/auth/register"
                            className="block w-full py-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                          >
                            Đăng ký miễn phí
                          </Link>
                          <Link
                            href="/auth/login"
                            className="block w-full py-3 text-center bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-primary)] transition-colors"
                          >
                            Đăng nhập
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/pricing?plan=${course.required_tier}`}
                          className="block w-full py-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Crown className="w-5 h-5" />
                          Nâng cấp ngay
                        </Link>
                      )}
                    </>
                  )}
                </div>

                {/* Instructor Card */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Giảng viên</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                      {(course.instructor as { full_name?: string })?.full_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {(course.instructor as { full_name?: string })?.full_name || 'Admin'}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {(course.instructor as { bio?: string })?.bio || 'Giảng viên'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Thông tin</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Số bài học</span>
                      <span className="font-medium text-[var(--text-primary)]">{course.lessons_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Thời lượng</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {hours > 0 ? `${hours}h ${minutes}m` : `${minutes} phút`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Yêu cầu</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {TIER_LABELS[course.required_tier]}
                      </span>
                    </div>
                    {course.required_level > 1 && (
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Level tối thiểu</span>
                        <span className="font-medium text-[var(--text-primary)]">
                          Level {course.required_level}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
