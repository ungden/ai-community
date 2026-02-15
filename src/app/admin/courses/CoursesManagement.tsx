'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Course, Category, SubscriptionTier, ContentStatus } from '@/lib/database.types'

interface CourseWithRelations extends Course {
  category: { id: string; name: string; icon: string } | null
  instructor: { id: string; full_name: string } | null
}

interface CoursesManagementProps {
  initialCourses: CourseWithRelations[]
  categories: { id: string; name: string; icon: string }[]
  currentUserId: string
}

const TIERS: { value: SubscriptionTier; label: string; color: string }[] = [
  { value: 'free', label: 'Free', color: 'bg-green-100 text-green-700' },
  { value: 'basic', label: 'Basic', color: 'bg-blue-100 text-blue-700' },
  { value: 'premium', label: 'Premium', color: 'bg-yellow-100 text-yellow-700' },
]

const STATUSES: { value: ContentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export default function CoursesManagement({ initialCourses, categories, currentUserId }: CoursesManagementProps) {
  const [courses, setCourses] = useState<CourseWithRelations[]>(initialCourses)
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSave = async () => {
    if (!editingCourse?.title) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tiêu đề' })
      return
    }

    setLoading(true)
    setMessage(null)

    const supabase = createClient()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Không thể kết nối database' })
      setLoading(false)
      return
    }

    const slug = editingCourse.slug || generateSlug(editingCourse.title)
    const courseData = {
      title: editingCourse.title,
      slug,
      description: editingCourse.description || null,
      category_id: editingCourse.category_id || null,
      required_tier: editingCourse.required_tier || 'free',
      required_level: editingCourse.required_level || 1,
      duration_minutes: editingCourse.duration_minutes || 60,
      lessons_count: editingCourse.lessons_count || 0,
      status: editingCourse.status || 'draft',
      instructor_id: currentUserId,
    }

    if (isCreating) {
      const { data, error } = await (supabase as any)
        .from('courses')
        .insert(courseData)
        .select(`
          *,
          category:categories(id, name, icon),
          instructor:profiles(id, full_name)
        `)
        .single()

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setCourses([data, ...courses])
        setMessage({ type: 'success', text: 'Tạo khóa học thành công!' })
        setEditingCourse(null)
        setIsCreating(false)
      }
    } else if (editingCourse.id) {
      const { error } = await (supabase as any)
        .from('courses')
        .update(courseData)
        .eq('id', editingCourse.id)

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...courseData } as CourseWithRelations : c))
        setMessage({ type: 'success', text: 'Cập nhật thành công!' })
        setEditingCourse(null)
      }
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khóa học này?')) return

    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Không thể kết nối database' })
      setLoading(false)
      return
    }

    const { error } = await (supabase as any)
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setCourses(courses.filter(c => c.id !== id))
      setMessage({ type: 'success', text: 'Xóa thành công!' })
    }

    setLoading(false)
  }

  const toggleStatus = async (course: CourseWithRelations) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published'
    
    const supabase = createClient()
    if (!supabase) return

    const { error } = await (supabase as any)
      .from('courses')
      .update({ status: newStatus })
      .eq('id', course.id)

    if (!error) {
      setCourses(courses.map(c => c.id === course.id ? { ...c, status: newStatus } : c))
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quản lý Courses</h1>
                <p className="text-sm text-gray-500">{courses.length} khóa học</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCreating(true)
                setEditingCourse({ required_tier: 'free', required_level: 1, status: 'draft' })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1664d9]"
            >
              <Plus className="w-4 h-4" />
              Thêm khóa học
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500">
            Chưa có khóa học nào
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/50" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                      course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {course.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {course.description || 'Chưa có mô tả'}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration_minutes} phút
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.lessons_count} bài
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      Lv.{course.required_level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      TIERS.find(t => t.value === course.required_tier)?.color
                    }`}>
                      {course.required_tier.toUpperCase()}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleStatus(course)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        title={course.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {course.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setIsCreating(false)
                          setEditingCourse(course)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {isCreating ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
              </h2>
              <button 
                onClick={() => {
                  setEditingCourse(null)
                  setIsCreating(false)
                }} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  placeholder="VD: ChatGPT cho người mới bắt đầu"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  rows={3}
                  placeholder="Mô tả ngắn về khóa học..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  value={editingCourse.category_id || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category_id: e.target.value || null })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Required Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu gói</label>
                <div className="flex gap-2">
                  {TIERS.map(tier => (
                    <button
                      key={tier.value}
                      onClick={() => setEditingCourse({ ...editingCourse, required_tier: tier.value })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editingCourse.required_tier === tier.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Required Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu Level (1-9)</label>
                <input
                  type="number"
                  min={1}
                  max={9}
                  value={editingCourse.required_level || 1}
                  onChange={(e) => setEditingCourse({ ...editingCourse, required_level: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Duration & Lessons */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingCourse.duration_minutes || 60}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration_minutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số bài học</label>
                  <input
                    type="number"
                    min={0}
                    value={editingCourse.lessons_count || 0}
                    onChange={(e) => setEditingCourse({ ...editingCourse, lessons_count: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <div className="flex gap-2">
                  {STATUSES.map(status => (
                    <button
                      key={status.value}
                      onClick={() => setEditingCourse({ ...editingCourse, status: status.value })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editingCourse.status === status.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditingCourse(null)
                    setIsCreating(false)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1664d9] disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
