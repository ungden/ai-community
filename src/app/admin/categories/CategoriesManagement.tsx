'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  X,
  Check,
  ArrowLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/database.types'

interface CategoriesManagementProps {
  initialCategories: Category[]
}

const EMOJI_OPTIONS = ['🤖', '🧠', '🎨', '⚡', '📣', '💻', '✨', '📰', '📊', '❓', '🚀', '💡', '🔥', '📝', '🎯']
const COLOR_OPTIONS = ['#10a37f', '#7c3aed', '#ec4899', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#6366f1', '#14b8a6', '#f97316']

export default function CategoriesManagement({ initialCategories }: CategoriesManagementProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSave = async () => {
    if (!editingCategory?.name) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tên category' })
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

    const slug = editingCategory.slug || generateSlug(editingCategory.name)
    const categoryData = {
      name: editingCategory.name,
      slug,
      description: editingCategory.description || null,
      icon: editingCategory.icon || '📁',
      color: editingCategory.color || '#3b82f6',
      order_index: editingCategory.order_index || categories.length + 1,
    }

    if (isCreating) {
      const { data, error } = await (supabase as any)
        .from('categories')
        .insert(categoryData)
        .select()
        .single()

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setCategories([...categories, data])
        setMessage({ type: 'success', text: 'Tạo category thành công!' })
        setEditingCategory(null)
        setIsCreating(false)
      }
    } else if (editingCategory.id) {
      const { error } = await (supabase as any)
        .from('categories')
        .update(categoryData)
        .eq('id', editingCategory.id)

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryData } : c))
        setMessage({ type: 'success', text: 'Cập nhật thành công!' })
        setEditingCategory(null)
      }
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa category này?')) return

    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Không thể kết nối database' })
      setLoading(false)
      return
    }

    const { error } = await (supabase as any)
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setCategories(categories.filter(c => c.id !== id))
      setMessage({ type: 'success', text: 'Xóa thành công!' })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quản lý Categories</h1>
                <p className="text-sm text-gray-500">{categories.length} categories</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCreating(true)
                setEditingCategory({ icon: '📁', color: '#3b82f6' })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1664d9]"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Chưa có category nào
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                  
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {category.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description || 'Chưa có mô tả'}</p>
                  </div>

                  <span className="text-sm text-gray-400">/{category.slug}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsCreating(false)
                        setEditingCategory(category)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {isCreating ? 'Tạo Category mới' : 'Chỉnh sửa Category'}
              </h2>
              <button 
                onClick={() => {
                  setEditingCategory(null)
                  setIsCreating(false)
                }} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="VD: ChatGPT"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="VD: Hướng dẫn sử dụng ChatGPT"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setEditingCategory({ ...editingCategory, icon: emoji })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                        editingCategory.icon === emoji 
                          ? 'bg-blue-100 ring-2 ring-blue-500' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Màu</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingCategory({ ...editingCategory, color })}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        editingCategory.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditingCategory(null)
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
