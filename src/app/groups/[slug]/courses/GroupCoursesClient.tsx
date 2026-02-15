'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Clock,
  Zap,
  Lock,
  Play,
  Search
} from 'lucide-react'
import type { Profile, CourseWithInstructor } from '@/lib/database.types'

interface GroupCoursesClientProps {
  profile: Profile | null
  courses: CourseWithInstructor[]
  groupName: string
}

export default function GroupCoursesClient({ profile, courses }: GroupCoursesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = courses.filter(course => {
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
    return `${mins} phút`
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm khóa học..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chưa có khóa học nào trong nhóm</p>
          <p className="text-sm text-gray-400 mt-1">
            Khóa học sẽ sớm được cập nhật!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="relative h-40 bg-[#f0f2f5]">
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
                        <BookOpen className="w-10 h-10 text-gray-300" />
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
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-[#1877f2] ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {course.category && (
                      <div className="text-sm text-[#1877f2] font-medium mb-1">
                        {(course.category as any).name}
                      </div>
                    )}

                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-[#1877f2] transition-colors">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {(course.instructor as any)?.full_name?.charAt(0) || 'A'}
                      </div>
                      <span className="text-sm text-gray-600">
                        {(course.instructor as any)?.full_name || 'Admin'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessons_count} bài học
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(course.duration_minutes)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
