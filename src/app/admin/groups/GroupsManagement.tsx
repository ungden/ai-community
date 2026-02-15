'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  X,
  ArrowLeft,
  Users,
  MessageSquare,
  BookOpen,
  Globe,
  Lock,
  Crown,
  Star,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Group } from '@/lib/database.types'

interface GroupWithOwner extends Group {
  owner?: { full_name: string | null; avatar_url: string | null }
}

interface GroupsManagementProps {
  initialGroups: GroupWithOwner[]
  userId: string
}

const EMOJI_OPTIONS = ['🚀', '🤖', '⚡', '🎨', '💻', '👑', '🧠', '📚', '🔥', '💡', '🎯', '🏆', '📊', '🌟', '💎']
const COLOR_OPTIONS = ['#1877f2', '#10a37f', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444', '#6366f1', '#14b8a6', '#f97316']

export default function GroupsManagement({ initialGroups, userId }: GroupsManagementProps) {
  const [groups, setGroups] = useState<GroupWithOwner[]>(initialGroups)
  const [editingGroup, setEditingGroup] = useState<Partial<GroupWithOwner> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = async () => {
    if (!editingGroup?.name) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tên nhóm' })
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

    const slug = editingGroup.slug || generateSlug(editingGroup.name)
    const groupData = {
      name: editingGroup.name,
      slug,
      description: editingGroup.description || null,
      about: editingGroup.about || null,
      icon_emoji: editingGroup.icon_emoji || '🚀',
      color: editingGroup.color || '#1877f2',
      privacy: editingGroup.privacy || 'public',
      required_tier: editingGroup.required_tier || 'free',
      is_featured: editingGroup.is_featured || false,
      cover_image: editingGroup.cover_image || null,
    }

    if (isCreating) {
      const { data, error } = await (supabase as any)
        .from('groups')
        .insert({ ...groupData, owner_id: userId })
        .select(`
          *,
          owner:profiles(full_name, avatar_url)
        `)
        .single()

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        // Auto-add creator as owner member
        await (supabase as any)
          .from('group_members')
          .insert({ group_id: data.id, user_id: userId, role: 'owner' })

        setGroups([data, ...groups])
        setMessage({ type: 'success', text: 'Tạo nhóm thành công!' })
        setEditingGroup(null)
        setIsCreating(false)
      }
    } else if (editingGroup.id) {
      const { error } = await (supabase as any)
        .from('groups')
        .update(groupData)
        .eq('id', editingGroup.id)

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...groupData } : g))
        setMessage({ type: 'success', text: 'Cập nhật thành công!' })
        setEditingGroup(null)
      }
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa nhóm này? Tất cả bài viết và khóa học trong nhóm sẽ bị ảnh hưởng.')) return

    const supabase = createClient()
    if (!supabase) return

    const { error } = await (supabase as any)
      .from('groups')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setGroups(groups.filter(g => g.id !== id))
      setMessage({ type: 'success', text: 'Đã xóa nhóm!' })
    }
  }

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    const supabase = createClient()
    if (!supabase) return

    const { error } = await (supabase as any)
      .from('groups')
      .update({ is_featured: !currentValue })
      .eq('id', id)

    if (!error) {
      setGroups(groups.map(g => g.id === id ? { ...g, is_featured: !currentValue } : g))
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quản lý Nhóm</h1>
                <p className="text-sm text-gray-500">{groups.length} nhóm</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingGroup({ icon_emoji: '🚀', color: '#1877f2', privacy: 'public', required_tier: 'free', is_featured: false })
                setIsCreating(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg font-medium hover:bg-[#1664d9]"
            >
              <Plus className="w-4 h-4" />
              Tạo nhóm mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm nhóm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
          />
        </div>

        {/* Groups Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nhóm</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Thành viên</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Bài viết</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Khóa học</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Quyền</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Nổi bật</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${group.color}20` }}
                      >
                        {group.icon_emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{group.name}</span>
                          {group.privacy === 'private' && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                          {group.required_tier !== 'free' && (
                            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">
                              {group.required_tier.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{group.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-700">{group.member_count}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-700">{group.post_count}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-700">{group.course_count}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      group.privacy === 'public' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {group.privacy === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {group.privacy === 'public' ? 'Công khai' : 'Riêng tư'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleFeatured(group.id, group.is_featured)}
                      className={`p-1 rounded ${group.is_featured ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                    >
                      <Star className={`w-5 h-5 ${group.is_featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/groups/${group.slug}`}
                        className="p-2 text-gray-400 hover:text-[#1877f2] hover:bg-blue-50 rounded-lg"
                        title="Xem nhóm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setEditingGroup(group)
                          setIsCreating(false)
                        }}
                        className="p-2 text-gray-400 hover:text-[#1877f2] hover:bg-blue-50 rounded-lg"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGroups.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Chưa có nhóm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {isCreating ? 'Tạo nhóm mới' : 'Chỉnh sửa nhóm'}
              </h2>
              <button
                onClick={() => { setEditingGroup(null); setIsCreating(false) }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm *</label>
                <input
                  type="text"
                  value={editingGroup.name || ''}
                  onChange={(e) => setEditingGroup({
                    ...editingGroup,
                    name: e.target.value,
                    slug: isCreating ? generateSlug(e.target.value) : editingGroup.slug
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                  placeholder="VD: ChatGPT Mastery"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={editingGroup.slug || ''}
                  onChange={(e) => setEditingGroup({ ...editingGroup, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <input
                  type="text"
                  value={editingGroup.description || ''}
                  onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                  placeholder="Mô tả ngắn về nhóm..."
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu chi tiết</label>
                <textarea
                  value={editingGroup.about || ''}
                  onChange={(e) => setEditingGroup({ ...editingGroup, about: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20 resize-none"
                  placeholder="Giới thiệu chi tiết về nhóm..."
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingGroup.cover_image || ''}
                  onChange={(e) => setEditingGroup({ ...editingGroup, cover_image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                  placeholder="https://..."
                />
              </div>

              {/* Icon Emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setEditingGroup({ ...editingGroup, icon_emoji: emoji })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-colors ${
                        editingGroup.icon_emoji === emoji
                          ? 'border-[#1877f2] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Màu chủ đạo</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingGroup({ ...editingGroup, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        editingGroup.color === color
                          ? 'border-gray-900 scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Privacy & Tier */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quyền riêng tư</label>
                  <select
                    value={editingGroup.privacy || 'public'}
                    onChange={(e) => setEditingGroup({ ...editingGroup, privacy: e.target.value as 'public' | 'private' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                  >
                    <option value="public">Công khai</option>
                    <option value="private">Riêng tư</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu gói</label>
                  <select
                    value={editingGroup.required_tier || 'free'}
                    onChange={(e) => setEditingGroup({ ...editingGroup, required_tier: e.target.value as 'free' | 'basic' | 'premium' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                  >
                    <option value="free">Miễn phí</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingGroup.is_featured || false}
                  onChange={(e) => setEditingGroup({ ...editingGroup, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#1877f2] focus:ring-[#1877f2]"
                />
                <span className="text-sm text-gray-700">Nhóm nổi bật</span>
              </label>

              {/* Preview */}
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Xem trước:</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${editingGroup.color || '#1877f2'}20` }}
                  >
                    {editingGroup.icon_emoji || '🚀'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{editingGroup.name || 'Tên nhóm'}</p>
                    <p className="text-xs text-gray-500">{editingGroup.description || 'Mô tả nhóm'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => { setEditingGroup(null); setIsCreating(false) }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-[#1877f2] text-white rounded-lg text-sm font-medium hover:bg-[#1664d9] disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCreating ? 'Tạo nhóm' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
