'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Trophy,
  Medal,
  Crown,
  Zap,
  Info
} from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/database.types'
import { getUserLevel, getLevelName, getEmojiAvatar, EMOJI_AVATARS, LEVEL_THRESHOLDS } from '@/lib/gamification'

interface LeaderboardsClientProps {
  user: User
  profile: Profile | null
  members: Profile[]
  userRank: number
}

export default function LeaderboardsClient({ user, profile, members, userRank }: LeaderboardsClientProps) {

  const getUserLevelInfo = (points: number) => {
    const level = getUserLevel(points)
    const name = getLevelName(level)
    const threshold = LEVEL_THRESHOLDS.find(t => t.level === level)
    return { level, name, minPoints: threshold?.points || 0 }
  }

  const getNextLevel = (points: number) => {
    const level = getUserLevel(points)
    const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === level + 1)
    if (nextThreshold) {
      return { level: nextThreshold.level, name: getLevelName(nextThreshold.level), minPoints: nextThreshold.points }
    }
    return null
  }

  const getProgressToNextLevel = (points: number) => {
    const currentInfo = getUserLevelInfo(points)
    const nextLevel = getNextLevel(points)
    if (!nextLevel) return 100
    
    const pointsInCurrentLevel = points - currentInfo.minPoints
    const pointsNeededForNextLevel = nextLevel.minPoints - currentInfo.minPoints
    return Math.min((pointsInCurrentLevel / pointsNeededForNextLevel) * 100, 100)
  }

  const userPoints = profile?.points || 0
  const userLevelInfo = getUserLevelInfo(userPoints)
  const nextLevelInfo = getNextLevel(userPoints)
  const progressPercent = getProgressToNextLevel(userPoints)

  return (
    <MainLayout user={user} profile={profile} showCommunityHeader={false}>
      <div className="bg-[#f0f2f5] min-h-screen">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bảng xếp hạng
            </h1>
            <p className="text-gray-600">
              Xếp hạng dựa trên điểm tích lũy từ hoạt động trong cộng đồng
            </p>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Leaderboard */}
            <div className="lg:col-span-2 space-y-4">
              {/* Heading */}
              <h2 className="px-4 py-2 rounded-full text-sm font-medium bg-[#1877f2] text-white inline-block">
                Tất cả
              </h2>

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
                      <p className="text-sm text-gray-500">{members[1].points} điểm</p>
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
                      <p className="text-sm text-gray-500">{members[0].points} điểm</p>
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
                      <p className="text-sm text-gray-500">{members[2].points} điểm</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Rest of the leaderboard */}
              <div className="space-y-2">
                {members.slice(3).map((member, idx) => {
                  const rank = idx + 4
                  const memberLevel = getUserLevelInfo(member.points)
                  const isCurrentUser = member.id === user.id

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
                          <p className="font-bold text-gray-900">{member.points}</p>
                          <p className="text-xs text-gray-500">điểm</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Your Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-5"
              >
                <h3 className="font-bold text-gray-900 mb-4">Thống kê của bạn</h3>
                
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
                    <p className="text-2xl font-bold text-gray-900">{userPoints}</p>
                    <p className="text-xs text-gray-500">Điểm</p>
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
                      Cần thêm {nextLevelInfo.minPoints - userPoints} điểm
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Levels Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-[#1877f2]" />
                  <h3 className="font-bold text-gray-900">Cấp độ</h3>
                </div>
                
                <div className="space-y-2">
                  {[...LEVEL_THRESHOLDS].reverse().map((t) => (
                    <div 
                      key={t.level}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        t.level === userLevelInfo.level ? 'bg-[#1877f2]/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          t.level === userLevelInfo.level 
                            ? 'bg-[#1877f2] text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          Lv.{t.level}
                        </span>
                        <span className={`text-sm ${t.level === userLevelInfo.level ? 'text-[#1877f2] font-medium' : 'text-gray-600'}`}>
                          {getLevelName(t.level)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {t.points}+ điểm
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* How to earn points */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-gray-900">Cách kiếm điểm</h3>
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
                    <span className="text-gray-600">Hoàn thành khóa học</span>
                    <span className="text-gray-900 font-medium">+10 điểm</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
