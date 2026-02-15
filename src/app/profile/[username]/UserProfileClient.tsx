'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Sun,
  Moon,
  Brain,
  Award,
  Calendar,
  FileText,
  Eye,
  Heart,
  Edit,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import type { Profile, Badge } from '@/lib/database.types'

interface UserBadge {
  badge_id: string
  earned_at: string
  badge: Badge
}

interface RecentPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  views: number
  likes: number
  published_at: string | null
}

interface UserProfileClientProps {
  profile: Profile
  badges: UserBadge[]
  recentPosts: RecentPost[]
  isOwnProfile: boolean
}

const EMOJI_AVATARS = ['🧑‍💻', '👨‍💼', '👩‍🎨', '🧑‍🔬', '👨‍🏫', '👩‍💻', '🧑‍🚀', '👨‍🎓', '👩‍🔧', '🧑‍🎤']

function getEmojiAvatar(name: string): string {
  const charCode = name ? name.charCodeAt(0) : 0
  return EMOJI_AVATARS[charCode % EMOJI_AVATARS.length]
}

function getUserLevel(points: number) {
  const levels = [
    { name: 'Người mới', min: 0, level: 1 },
    { name: 'Học viên', min: 50, level: 2 },
    { name: 'Thành viên', min: 200, level: 3 },
    { name: 'Đóng góp', min: 500, level: 4 },
    { name: 'Chuyên gia', min: 1200, level: 5 },
    { name: 'Mentor', min: 2800, level: 6 },
    { name: 'Leader', min: 6000, level: 7 },
    { name: 'Master', min: 13000, level: 8 },
    { name: 'Siêu sao', min: 33015, level: 9 },
  ]
  let current = levels[0]
  for (const level of levels) {
    if (points >= level.min) current = level
    else break
  }
  return current
}

export default function UserProfileClient({ profile, badges, recentPosts, isOwnProfile }: UserProfileClientProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const level = getUserLevel(profile.points)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-light)] mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl">
                {getEmojiAvatar(profile.full_name || '')}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    {profile.full_name || 'Thành viên'}
                  </h1>
                  {isOwnProfile && (
                    <Link
                      href="/profile"
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}
                </div>
                {profile.username && (
                  <p className="text-[var(--text-tertiary)] mb-2">@{profile.username}</p>
                )}
                {profile.bio && (
                  <p className="text-[var(--text-secondary)] mb-4">{profile.bio}</p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                  <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-[var(--text-primary)]">{profile.points}</span>
                    <span>điểm</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                    Lv.{level.level} {level.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Calendar className="w-4 h-4" />
                    <span>Tham gia {formatDate(profile.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Huy hiệu ({badges.length})
                </h2>
                {badges.length === 0 ? (
                  <p className="text-sm text-[var(--text-tertiary)]">Chưa có huy hiệu nào</p>
                ) : (
                  <div className="space-y-3">
                    {badges.map((ub) => (
                      <div key={ub.badge_id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-lg">
                          {(ub.badge as { icon?: string })?.icon || '🏆'}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[var(--text-primary)]">
                            {(ub.badge as { name?: string })?.name || 'Huy hiệu'}
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

            {/* Recent Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Bài viết gần đây
                </h2>
                {recentPosts.length === 0 ? (
                  <p className="text-sm text-[var(--text-tertiary)]">Chưa có bài viết nào</p>
                ) : (
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.slug}`}
                        className="block p-4 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-light)] transition-colors"
                      >
                        <h3 className="font-medium text-[var(--text-primary)] mb-1 line-clamp-1">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {post.likes}
                          </span>
                          {post.published_at && (
                            <span>{formatDate(post.published_at)}</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
