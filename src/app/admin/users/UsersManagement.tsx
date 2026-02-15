'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Ban,
  Crown,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ArrowLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, SubscriptionTier, UserRole } from '@/lib/database.types'
import { getUserLevel } from '@/lib/gamification'

interface UsersManagementProps {
  initialUsers: Profile[]
  totalCount: number
}

const SUBSCRIPTION_TIERS: { value: SubscriptionTier; label: string; color: string }[] = [
  { value: 'free', label: 'Free', color: 'bg-gray-100 text-gray-700' },
  { value: 'basic', label: 'Basic', color: 'bg-blue-100 text-blue-700' },
  { value: 'premium', label: 'Premium', color: 'bg-yellow-100 text-yellow-700' },
]

const USER_ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: 'member', label: 'Member', color: 'bg-gray-100 text-gray-700' },
  { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-700' },
]

export default function UsersManagement({ initialUsers, totalCount }: UsersManagementProps) {
  const router = useRouter()
  const [users, setUsers] = useState<Profile[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTier, setFilterTier] = useState<string>('all')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = filterTier === 'all' || user.subscription_tier === filterTier
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesTier && matchesRole
  })

  const handleUpdateUser = async (userId: string, updates: Partial<Profile>) => {
    setLoading(true)
    setMessage(null)
    
    const supabase = createClient()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Không thể kết nối database' })
      setLoading(false)
      return
    }

    const { error } = await (supabase as any)
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u))
      setMessage({ type: 'success', text: 'Cập nhật thành công!' })
      setEditingUser(null)
    }
    
    setLoading(false)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quản lý Users</h1>
                <p className="text-sm text-gray-500">{totalCount} users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Filter by Tier */}
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">Tất cả gói</option>
              {SUBSCRIPTION_TIERS.map(tier => (
                <option key={tier.value} value={tier.value}>{tier.label}</option>
              ))}
            </select>

            {/* Filter by Role */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">Tất cả role</option>
              {USER_ROLES.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gói</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                          {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name || 'Chưa đặt tên'}</p>
                          <p className="text-sm text-gray-500">@{user.username || user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        Lv.{getUserLevel(user.points)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        SUBSCRIPTION_TIERS.find(t => t.value === user.subscription_tier)?.color
                      }`}>
                        {user.subscription_tier.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        USER_ROLES.find(r => r.value === user.role)?.color
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              Không tìm thấy user nào
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Chỉnh sửa User</h2>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                  {editingUser.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{editingUser.full_name || 'Chưa đặt tên'}</p>
                  <p className="text-sm text-gray-500">{editingUser.points.toLocaleString()} điểm</p>
                </div>
              </div>

              {/* Subscription Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gói đăng ký</label>
                <div className="flex gap-2">
                  {SUBSCRIPTION_TIERS.map(tier => (
                    <button
                      key={tier.value}
                      onClick={() => handleUpdateUser(editingUser.id, { subscription_tier: tier.value })}
                      disabled={loading}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editingUser.subscription_tier === tier.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="flex gap-2">
                  {USER_ROLES.map(role => (
                    <button
                      key={role.value}
                      onClick={() => handleUpdateUser(editingUser.id, { role: role.value })}
                      disabled={loading}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editingUser.role === role.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Points */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <input
                  type="number"
                  value={editingUser.points}
                  onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  onClick={() => handleUpdateUser(editingUser.id, { points: editingUser.points })}
                  disabled={loading}
                  className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Cập nhật Points
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
