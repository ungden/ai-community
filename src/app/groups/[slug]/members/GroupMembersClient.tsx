'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  Shield,
  Crown,
  Users
} from 'lucide-react'
import { getUserLevel, getLevelName, getEmojiAvatar, EMOJI_AVATARS } from '@/lib/gamification'

interface MemberData {
  id: string
  full_name: string | null
  username: string | null
  points: number
  points_in_group: number
  role?: string
  group_role: string
  joined_at: string
}

interface GroupMembersClientProps {
  members: MemberData[]
  currentUserId: string
  groupName: string
}

export default function GroupMembersClient({ members, currentUserId, groupName }: GroupMembersClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMembers = members.filter(member => {
    if (searchQuery) {
      const name = (member.full_name || '').toLowerCase()
      return name.includes(searchQuery.toLowerCase())
    }
    return true
  })

  const getRoleBadge = (groupRole: string) => {
    switch (groupRole) {
      case 'owner':
        return { label: 'Chủ nhóm', color: 'bg-yellow-100 text-yellow-800', icon: Crown }
      case 'admin':
        return { label: 'Quản trị', color: 'bg-blue-100 text-blue-800', icon: Shield }
      case 'moderator':
        return { label: 'Điều hành', color: 'bg-green-100 text-green-800', icon: Shield }
      default:
        return null
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {/* Search & Count */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1877f2]" />
            {filteredMembers.length} thành viên
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm thành viên..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
          />
        </div>
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Không tìm thấy thành viên nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMembers.map((member, idx) => {
            const level = getUserLevel(member.points_in_group || member.points || 0)
            const roleBadge = getRoleBadge(member.group_role)
            const isCurrentUser = member.id === currentUserId

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Link
                  href={`/profile/${member.username || member.id}`}
                  className={`block bg-white rounded-lg shadow-sm p-4 hover:bg-gray-50 transition-colors ${
                    isCurrentUser ? 'ring-2 ring-[#1877f2]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {getEmojiAvatar(member.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-semibold truncate ${isCurrentUser ? 'text-[#1877f2]' : 'text-gray-900'}`}>
                          {member.full_name || 'Ẩn danh'}
                          {isCurrentUser && <span className="text-xs font-normal ml-1">(Bạn)</span>}
                        </p>
                        {roleBadge && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${roleBadge.color}`}>
                            {roleBadge.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          Lv.{level} {getLevelName(level)}
                        </span>
                        <span>{(member.points_in_group || member.points || 0).toLocaleString()} điểm</span>
                        <span>Tham gia {formatDate(member.joined_at)}</span>
                      </div>
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
