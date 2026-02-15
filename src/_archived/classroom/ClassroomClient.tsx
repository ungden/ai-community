'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Clock,
  BookOpen,
  Zap,
  Lock,
  Play,
  Crown,
  ChevronRight,
  CheckCircle
} from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import type { User } from '@supabase/supabase-js'
import type { Profile, Category, CourseWithInstructor } from '@/lib/database.types'

interface ClassroomClientProps {
  user: User
  profile: Profile | null
  categories: Category[]
  initialCourses: CourseWithInstructor[]
}

export default function ClassroomClient({ user, profile, categories, initialCourses }: ClassroomClientProps) {
  const [courses] = useState(initialCourses)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'all' | 'in-progress' | 'completed'>('all')

  const filteredCourses = courses.filter(course => {
    if (selectedCategory && course.category_id !== selectedCategory) return false
    return true
  })

  const canAccessCourse = (course: CourseWithInstructor) => {
    // Check tier requirement
    if (course.required_tier !== 'free') {
      if (!profile) return false
      const tierHierarchy = { free: 0, basic: 1, premium: 2 }
      if (tierHierarchy[profile.subscription_tier] < tierHierarchy[course.required_tier]) {
        return false
      }
    }
    
    // Check level requirement
    const requiredLevel = course.required_level || 1
    const userLevel = profile ? getUserLevel(profile.points) : 1
    if (userLevel < requiredLevel) {
      return false
    }
    
    return true
  }
  
  const getLockReason = (course: CourseWithInstructor) => {
    if (!profile) return 'Đăng nhập để xem'
    
    const tierHierarchy = { free: 0, basic: 1, premium: 2 }
    if (course.required_tier !== 'free' && tierHierarchy[profile.subscription_tier] < tierHierarchy[course.required_tier]) {
      return `Yêu cầu gói ${course.required_tier.toUpperCase()}`
    }
    
    const requiredLevel = course.required_level || 1
    const userLevel = getUserLevel(profile.points)
    if (userLevel < requiredLevel) {
      return `Yêu cầu Level ${requiredLevel}`
    }
    
    return ''
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins} phút`
  }

  const getUserLevel = (points: number) => {
    if (points >= 33015) return 9
    if (points >= 8015) return 8
    if (points >= 2015) return 7
    if (points >= 515) return 6
    if (points >= 155) return 5
    if (points >= 65) return 4
    if (points >= 20) return 3
    if (points >= 5) return 2
    return 1
  }

  // Calculate stats
  const totalCourses = courses.length
  const accessibleCourses = courses.filter(c => canAccessCourse(c)).length
  const lockedCourses = totalCourses - accessibleCourses

  return (
    <MainLayout user={user} profile={profile} showCommunityHeader={false}>
      <div className="bg-[#f0f2f5] min-h-screen">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Khóa học
            </h1>
            <p className="text-gray-600">
              Học cách áp dụng AI vào công việc thực tế với các khóa học có cấu trúc
            </p>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1877f2]/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#1877f2]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
                  <p className="text-sm text-gray-500">Tổng khóa học</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{accessibleCourses}</p>
                  <p className="text-sm text-gray-500">Có thể truy cập</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{lockedCourses}</p>
                  <p className="text-sm text-gray-500">Cần nâng cấp</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-[#1877f2] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#1877f2] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* View Mode Filter */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setViewMode('in-progress')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'in-progress'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Đang học
              </button>
              <button
                onClick={() => setViewMode('completed')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'completed'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Hoàn thành
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Không tìm thấy khóa học nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                      href={hasAccess ? `/classroom/${course.slug}` : '/pricing'}
                      className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all group"
                    >
                      <div className="relative h-44 bg-gray-100">
                        {course.cover_image ? (
                          <Image
                            src={course.cover_image}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1877f2]/20 to-purple-500/20">
                            <BookOpen className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        {!hasAccess && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center text-white">
                              <Lock className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-medium text-sm">{getLockReason(course)}</p>
                            </div>
                          </div>
                        )}

                        {course.required_tier !== 'free' && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {course.required_tier.toUpperCase()}
                          </div>
                        )}

                        {hasAccess && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="w-6 h-6 text-[#1877f2] ml-1" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        {course.category && (
                          <div className="text-sm text-[#1877f2] font-medium mb-2">
                            {course.category.name}
                          </div>
                        )}
                        
                        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1877f2] transition-colors">
                          {course.title}
                        </h3>

                        {course.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {course.description}
                          </p>
                        )}

                        {/* Progress bar placeholder */}
                        {hasAccess && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Tiến độ</span>
                              <span>0%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#1877f2] rounded-full" style={{ width: '0%' }} />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {course.lessons_count} bài
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
          {profile?.subscription_tier === 'free' && lockedCourses > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-gradient-to-r from-[#1877f2] to-[#1664d9] rounded-lg p-8 text-white text-center"
            >
              <Crown className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl font-bold mb-2">Mở khóa tất cả khóa học</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Nâng cấp lên Premium để truy cập {lockedCourses} khóa học đang bị khóa và nhiều nội dung độc quyền khác.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1877f2] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Xem bảng giá
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
