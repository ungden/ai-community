'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Zap
} from 'lucide-react'
import type { Profile } from '@/lib/database.types'

interface MemberData {
  id: string
  full_name: string | null
  username: string | null
  points: number
  points_in_group: number
  group_role: string
}

interface GroupLeaderboardsClientProps {
  currentUserId: string
  profile: Profile | null
  members: MemberData[]
  userRank: number
  groupName: string
}

const LEVELS = [
  { level: 1, minPoints: 0, name: 'Người mới' },
  { level: 2, minPoints: 5, name: 'Thành viên' },
  { level: 3, minPoints: 20, name: 'Tích cực' },
  { level: 4, minPoints: 65, name: 'Cộng tác viên' },
  { level: 5, minPoints: 155, name: 'Chuyên gia' },
  { level: 6, minPoints: 515, name: 'Cao cấp' },
  { level: 7, minPoints: 2015, name: 'Bậc thầy' },
  { level: 8, minPoints: 8015, name: 'Huyền thoại' },
  { level: 9, minPoints: 33015, name: 'Siêu sao' },
]

const EMOJI_AVATARS = ['🧑‍💻', '👨‍💼', '👩‍🎨', '👨‍🔬', '👩‍💻', '🧑‍🎓', '👨‍🏫', '👩‍🔧', '🧑‍🚀', '👨‍🍳']

export default function GroupLeaderboardsClient({
  currentUserId,
  profile,
  members,
  userRank,
  groupName,
}: GroupLeaderboardsClientProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all')

  const getUserLevel = (points: number) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i]
      }
    }
    return LEVELS[0]
  }

  const getNextLevel = (points: number) => {
    const currentLevel = getUserLevel(points)
    const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1
    if (nextLevelIndex < LEVELS.length) {
      return LEVELS[nextLevelIndex]
    }
    return null
  }

  const getProgressToNextLevel = (points: number) => {
    const currentLevel = getUserLevel(points)
    const nextLevel = getNextLevel(points)
    if (!nextLevel) return 100

    const pointsInCurrentLevel = points - currentLevel.minPoints
    const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints
    return Math.min((pointsInCurrentLevel / pointsNeededForNextLevel) * 100, 100)
  }

  const getEmojiAvatar = (name: string | null | undefined) => {
    if (!name) return '👤'
    const index = name.charCodeAt(0) % EMOJI_AVATARS.length
    return EMOJI_AVATARS[index]
  }

  const userGroupPoints = members.find(m => m.id === currentUserId)?.points_in_group || 0
  const userLevelInfo = getUserLevel(userGroupPoints)
  const nextLevelInfo = getNextLevel(userGroupPoints)
  const progressPercent = getProgressToNextLevel(userGroupPoints)

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">Bảng xếp hạng nhóm</h2>
        </div>
        <p className="text-sm text-gray-600">
          Xếp hạng dựa trên điểm tích lũy từ hoạt động trong nhóm {groupName}
        </p>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            timeFilter === 'all'
              ? 'bg-[#1877f2] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setTimeFilter('month')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            timeFilter === 'month'
              ? 'bg-[#1877f2] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
          }`}
        >
          Tháng này
        </button>
        <button
          onClick={() => setTimeFilter('week')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            timeFilter === 'week'
              ? 'bg-[#1877f2] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
          }`}
        >
          Tuần này
        </button>
      </div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-end justify-center gap-4 mb-6">
          {/* 2nd Place */}
          {members[1] && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl mb-2 ring-4 ring-gray-300">
                {getEmojiAvatar(members[1].full_name)}
              </div>
              <span className="text-2xl">🥈</span>
              <p className="font-semibold text-gray-900 truncate max-w-[100px] mt-1">
                {members[1].full_name || 'Ẩn danh'}
              </p>
              <p className="text-sm text-gray-500">{members[1].points_in_group} điểm</p>
            </div>
          )}

          {/* 1st Place */}
          {members[0] && (
            <div className="text-center -mt-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-4xl mb-2 ring-4 ring-yellow-400">
                {getEmojiAvatar(members[0].full_name)}
              </div>
              <span className="text-3xl">🥇</span>
              <p className="font-bold text-gray-900 truncate max-w-[120px] mt-1">
                {members[0].full_name || 'Ẩn danh'}
              </p>
              <p className="text-sm text-gray-500">{members[0].points_in_group} điểm</p>
            </div>
          )}

          {/* 3rd Place */}
          {members[2] && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl mb-2 ring-4 ring-amber-500">
                {getEmojiAvatar(members[2].full_name)}
              </div>
              <span className="text-2xl">🥉</span>
              <p className="font-semibold text-gray-900 truncate max-w-[100px] mt-1">
                {members[2].full_name || 'Ẩn danh'}
              </p>
              <p className="text-sm text-gray-500">{members[2].points_in_group} điểm</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Your Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-5"
      >
        <h3 className="font-bold text-gray-900 mb-4">Thống kê của bạn trong nhóm</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-3xl">
            {getEmojiAvatar(profile?.full_name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {profile?.full_name || 'Người dùng'}
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#1877f2] text-white text-xs font-bold rounded">
                Lv.{userLevelInfo.level}
              </span>
              <span className="text-sm text-gray-500">{userLevelInfo.name}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#f0f2f5] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">#{userRank}</p>
            <p className="text-xs text-gray-500">Xếp hạng</p>
          </div>
          <div className="bg-[#f0f2f5] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{userGroupPoints}</p>
            <p className="text-xs text-gray-500">Điểm nhóm</p>
          </div>
        </div>

        {nextLevelInfo && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Tiến độ lên Level {nextLevelInfo.level}</span>
              <span className="text-gray-500">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 bg-[#f0f2f5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1877f2] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Cần thêm {nextLevelInfo.minPoints - userGroupPoints} điểm
            </p>
          </div>
        )}
      </motion.div>

      {/* Rest of the leaderboard */}
      <div className="space-y-2">
        {members.slice(3).map((member, idx) => {
          const rank = idx + 4
          const memberLevel = getUserLevel(member.points_in_group)
          const isCurrentUser = member.id === currentUserId

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={`bg-white rounded-lg shadow-sm p-4 transition-colors ${
                isCurrentUser ? 'ring-2 ring-[#1877f2]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 text-center font-bold text-gray-500">
                  {rank}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl">
                  {getEmojiAvatar(member.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold truncate ${isCurrentUser ? 'text-[#1877f2]' : 'text-gray-900'}`}>
                      {member.full_name || 'Ẩn danh'}
                      {isCurrentUser && <span className="text-xs font-normal ml-1">(Bạn)</span>}
                    </p>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      Lv.{memberLevel.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{memberLevel.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{member.points_in_group}</p>
                  <p className="text-xs text-gray-500">điểm</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* How to earn points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-gray-900">Cách kiếm điểm trong nhóm</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Bài viết được like</span>
            <span className="text-gray-900 font-medium">+1 điểm/like</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Comment được like</span>
            <span className="text-gray-900 font-medium">+1 điểm/like</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Hoàn thành khóa học nhóm</span>
            <span className="text-gray-900 font-medium">+10 điểm</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
