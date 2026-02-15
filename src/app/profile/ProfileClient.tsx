'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Brain,
  ArrowLeft,
  Sun,
  Moon,
  Crown,
  Award,
  Calendar,
  Edit,
  LogOut,
  BookOpen,
  FileText,
  Zap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { vi } from '@/lib/translations'
import type { User } from '@supabase/supabase-js'
import type { Profile, Badge, Subscription } from '@/lib/database.types'

interface UserBadge {
  badge_id: string
  earned_at: string
  badge: Badge
}

interface ProfileClientProps {
  user: User
  profile: Profile | null
  badges: UserBadge[]
  activeSubscription: Subscription | null
}

export default function ProfileClient({ user, profile, badges, activeSubscription }: ProfileClientProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'basic':
        return 'bg-blue-500/10 text-blue-500'
      default:
        return 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
    }
  }

  const getUserLevel = (points: number) => {
    if (points >= 33015) return { level: 9, name: 'Siêu sao', nextPoints: null }
    if (points >= 8015) return { level: 8, name: 'Huyền thoại', nextPoints: 33015 }
    if (points >= 2015) return { level: 7, name: 'Bậc thầy', nextPoints: 8015 }
    if (points >= 515) return { level: 6, name: 'Chuyên gia cao cấp', nextPoints: 2015 }
    if (points >= 155) return { level: 5, name: 'Chuyên gia', nextPoints: 515 }
    if (points >= 65) return { level: 4, name: 'Cộng tác viên', nextPoints: 155 }
    if (points >= 20) return { level: 3, name: 'Thành viên tích cực', nextPoints: 65 }
    if (points >= 5) return { level: 2, name: 'Thành viên', nextPoints: 20 }
    return { level: 1, name: 'Người mới', nextPoints: 5 }
  }

  const userLevelInfo = getUserLevel(profile?.points || 0)
  const progressToNext = userLevelInfo.nextPoints 
    ? Math.min(((profile?.points || 0) / userLevelInfo.nextPoints) * 100, 100)
    : 100

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/community"
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)] mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold border-4 border-[var(--bg-secondary)]">
                {userLevelInfo.level}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  {profile?.full_name || 'User'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(profile?.subscription_tier || 'free')}`}>
                  {profile?.subscription_tier === 'premium' && <Crown className="w-4 h-4 inline mr-1" />}
                  {profile?.subscription_tier?.toUpperCase() || 'FREE'}
                </span>
              </div>
              
              {/* Level Info */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-500">Level {userLevelInfo.level}</span>
                <span className="text-sm text-[var(--text-tertiary)]">•</span>
                <span className="text-sm text-[var(--text-secondary)]">{userLevelInfo.name}</span>
              </div>
              
              {/* Progress Bar */}
              {userLevelInfo.nextPoints && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-1">
                    <span>{profile?.points || 0} điểm</span>
                    <span>Level {userLevelInfo.level + 1}: {userLevelInfo.nextPoints} điểm</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              )}
              
              <p className="text-[var(--text-secondary)] mb-4">
                {profile?.bio || 'Chưa có tiểu sử'}
              </p>
              <div className="flex items-center gap-6 text-sm text-[var(--text-tertiary)]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {vi.profile.memberSince} {profile?.created_at && formatDate(profile.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {profile?.points || 0} {vi.profile.points}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-primary)] transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              {vi.profile.editProfile}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
              <h2 className="font-semibold text-[var(--text-primary)] mb-4">
                {vi.profile.subscription}
              </h2>
              
              {profile?.subscription_tier === 'free' ? (
                <div className="text-center py-6">
                  <Crown className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)] mb-4">
                    Bạn đang sử dụng gói miễn phí
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <Crown className="w-5 h-5" />
                    {vi.subscription.upgrade}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-xl">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        Gói {profile?.subscription_tier?.toUpperCase()}
                      </p>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        {profile?.subscription_tier === 'basic' ? '199.000đ' : '399.000đ'}/tháng
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(profile?.subscription_tier || 'free')}`}>
                      Đang hoạt động
                    </div>
                  </div>
                  
                  {profile?.subscription_expires_at && (
                    <p className="text-sm text-[var(--text-tertiary)]">
                      {vi.subscription.expiresOn}: {formatDate(profile.subscription_expires_at)}
                    </p>
                  )}
                  
                  <Link
                    href="/pricing"
                    className="block w-full text-center py-2.5 border border-[var(--border-color)] rounded-xl font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    {vi.subscription.managePlan}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
              <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {vi.profile.badges}
              </h2>
              
              {badges.length === 0 ? (
                <p className="text-[var(--text-tertiary)] text-center py-4">
                  Chưa có huy hiệu nào
                </p>
              ) : (
                <div className="space-y-3">
                  {badges.map((ub) => (
                    <div key={ub.badge_id} className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-xl">
                      <span className="text-2xl">{ub.badge?.icon}</span>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {ub.badge?.name}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)]">
                          {formatDate(ub.earned_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <Link
            href="/community"
            className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)] hover:border-blue-500/30 transition-colors text-center"
          >
            <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Bài viết</span>
          </Link>
          <Link
            href="/courses"
            className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)] hover:border-green-500/30 transition-colors text-center"
          >
            <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Khóa học</span>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)] hover:border-red-500/30 transition-colors text-center"
          >
            <LogOut className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-[var(--text-primary)]">{vi.auth.logout}</span>
          </button>
        </motion.div>
      </main>
    </div>
  )
}
