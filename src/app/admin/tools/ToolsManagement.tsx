'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  Star,
  X,
  ArrowLeft,
  ExternalLink
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Tool, ToolCategory, ToolPricing } from '@/lib/database.types'

interface ToolsManagementProps {
  initialTools: Tool[]
}

const CATEGORIES: { value: ToolCategory; label: string }[] = [
  { value: 'llm', label: 'AI Chatbots' },
  { value: 'image', label: 'Image Generation' },
  { value: 'video', label: 'Video AI' },
  { value: 'audio', label: 'Audio AI' },
  { value: 'automation', label: 'Automation' },
  { value: 'coding', label: 'Coding' },
  { value: 'writing', label: 'Writing' },
]

const PRICING: { value: ToolPricing; label: string; color: string }[] = [
  { value: 'free', label: 'Free', color: 'bg-green-100 text-green-700' },
  { value: 'freemium', label: 'Freemium', color: 'bg-blue-100 text-blue-700' },
  { value: 'paid', label: 'Paid', color: 'bg-orange-100 text-orange-700' },
]

export default function ToolsManagement({ initialTools }: ToolsManagementProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools)
  const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null)
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
    if (!editingTool?.name) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tên tool' })
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

    const slug = editingTool.slug || generateSlug(editingTool.name)
    const toolData = {
      name: editingTool.name,
      slug,
      description: editingTool.description || null,
      website_url: editingTool.website_url || null,
      category: editingTool.category || 'llm',
      pricing: editingTool.pricing || 'freemium',
      pricing_detail: editingTool.pricing_detail || null,
      features: editingTool.features || [],
      use_cases: editingTool.use_cases || [],
      pros: editingTool.pros || [],
      cons: editingTool.cons || [],
      rating: editingTool.rating || 4.5,
      is_featured: editingTool.is_featured || false,
      order_index: editingTool.order_index || tools.length + 1,
    }

    if (isCreating) {
      const { data, error } = await (supabase as any)
        .from('tools')
        .insert(toolData)
        .select()
        .single()

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setTools([...tools, data])
        setMessage({ type: 'success', text: 'Tạo tool thành công!' })
        setEditingTool(null)
        setIsCreating(false)
      }
    } else if (editingTool.id) {
      const { error } = await (supabase as any)
        .from('tools')
        .update(toolData)
        .eq('id', editingTool.id)

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setTools(tools.map(t => t.id === editingTool.id ? { ...t, ...toolData } as Tool : t))
        setMessage({ type: 'success', text: 'Cập nhật thành công!' })
        setEditingTool(null)
      }
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tool này?')) return

    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Không thể kết nối database' })
      setLoading(false)
      return
    }

    const { error } = await (supabase as any)
      .from('tools')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setTools(tools.filter(t => t.id !== id))
      setMessage({ type: 'success', text: 'Xóa thành công!' })
    }

    setLoading(false)
  }

  const toggleFeatured = async (tool: Tool) => {
    const supabase = createClient()
    if (!supabase) return

    const { error } = await (supabase as any)
      .from('tools')
      .update({ is_featured: !tool.is_featured })
      .eq('id', tool.id)

    if (!error) {
      setTools(tools.map(t => t.id === tool.id ? { ...t, is_featured: !t.is_featured } : t))
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
                <h1 className="text-xl font-bold text-gray-900">Quản lý AI Tools</h1>
                <p className="text-sm text-gray-500">{tools.length} tools</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCreating(true)
                setEditingTool({ category: 'llm', pricing: 'freemium', rating: 4.5 })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1664d9]"
            >
              <Plus className="w-4 h-4" />
              Thêm tool
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

        {/* Tools Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {tools.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Chưa có tool nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tool</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pricing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                            {CATEGORIES.find(c => c.value === tool.category)?.label.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{tool.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{tool.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {CATEGORIES.find(c => c.value === tool.category)?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          PRICING.find(p => p.value === tool.pricing)?.color
                        }`}>
                          {tool.pricing}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{tool.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleFeatured(tool)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            tool.is_featured 
                              ? 'bg-yellow-100 text-yellow-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${tool.is_featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {tool.website_url && (
                            <a
                              href={tool.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              setIsCreating(false)
                              setEditingTool(tool)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tool.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {isCreating ? 'Thêm AI Tool mới' : 'Chỉnh sửa Tool'}
              </h2>
              <button 
                onClick={() => {
                  setEditingTool(null)
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                <input
                  type="text"
                  value={editingTool.name || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                  placeholder="VD: ChatGPT"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={editingTool.description || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={editingTool.website_url || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, website_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editingTool.category || 'llm'}
                    onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value as ToolCategory })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pricing</label>
                  <select
                    value={editingTool.pricing || 'freemium'}
                    onChange={(e) => setEditingTool({ ...editingTool, pricing: e.target.value as ToolPricing })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {PRICING.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Detail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chi tiết giá</label>
                <input
                  type="text"
                  value={editingTool.pricing_detail || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, pricing_detail: e.target.value })}
                  placeholder="VD: Free: GPT-3.5 | Plus: $20/tháng"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={editingTool.rating || 4.5}
                  onChange={(e) => setEditingTool({ ...editingTool, rating: parseFloat(e.target.value) || 4.5 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={editingTool.is_featured || false}
                  onChange={(e) => setEditingTool({ ...editingTool, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="is_featured" className="text-sm text-gray-700">Tool nổi bật</label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditingTool(null)
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
