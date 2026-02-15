'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  Trophy,
  Bell,
  LogOut,
  User as UserIcon,
  Crown,
  Search,
  Menu,
  X,
  ChevronDown,
  Globe,
  Lock,
  MessageSquare,
  ArrowLeft,
  UserPlus,
  UserMinus,
  Shield,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Group } from '@/lib/database.types'
import { getUserLevel, getEmojiAvatar, EMOJI_AVATARS } from '@/lib/gamification'

interface GroupLayoutProps {
  children: React.ReactNode
  profile: Profile | null
  group: Group
  isMember: boolean
  topMembers: any[]
  slug: string
}

export default function GroupLayout({
  children,
  profile,
  group,
  isMember: initialIsMember,
  topMembers,
  slug,
}: GroupLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMember, setIsMember] = useState(initialIsMember)
  const [isJoining, setIsJoining] = useState(false)

  const NAV_ITEMS = [
    { href: `/groups/${slug}/community`, label: 'Cộng đồng', icon: MessageSquare },
    { href: `/groups/${slug}/courses`, label: 'Khóa học', icon: BookOpen },
    { href: `/groups/${slug}/members`, label: 'Thành viên', icon: Users },
    { href: `/groups/${slug}/leaderboards`, label: 'Xếp hạng', icon: Trophy },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/auth/login')
    router.refresh()
  }

  const handleJoinLeave = async () => {
    if (isJoining) return
    setIsJoining(true)
    try {
      const response = await fetch('/api/groups/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: group.id, action: isMember ? 'leave' : 'join' })
      })
      if (response.ok) {
        setIsMember(!isMember)
        router.refresh()
      }
    } catch {
      // Error handled silently
    } finally {
      setIsJoining(false)
    }
  }

  const userLevel = profile ? getUserLevel(profile.points) : 1

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Back + Group Name */}
            <div className="flex items-center gap-3">
              <Link href="/groups" className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href={`/groups/${slug}/community`} className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: group.color || '#1877f2' }}
                >
                  {group.icon_emoji || '👥'}
                </div>
                <span className="font-bold text-lg text-gray-900 hidden sm:block">
                  {group.name}
                </span>
              </Link>
            </div>

            {/* Center: Search (Desktop) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Tìm kiếm trong ${group.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                />
              </div>
            </div>

            {/* Right: Notifications, User */}
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-full bg-[#f0f2f5] hover:bg-gray-200 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-700" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[#f0f2f5] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg">
                    {profile?.full_name?.charAt(0) || '👤'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl">
                            {profile?.full_name?.charAt(0) || '👤'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {profile?.full_name || 'Người dùng'}
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="px-2 py-0.5 bg-[#1877f2] text-white text-xs font-bold rounded">
                                Lv.{userLevel}
                              </span>
                              <span className="text-gray-500">
                                {profile?.points || 0} điểm
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#f0f2f5] transition-colors"
                        >
                          <UserIcon className="w-5 h-5" />
                          Trang cá nhân
                        </Link>
                        <Link
                          href="/community"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#f0f2f5] transition-colors"
                        >
                          <MessageSquare className="w-5 h-5" />
                          Cộng đồng chính
                        </Link>
                        {profile?.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#f0f2f5] transition-colors"
                          >
                            <Crown className="w-5 h-5 text-yellow-500" />
                            Quản trị
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2.5 rounded-full bg-[#f0f2f5] hover:bg-gray-200 transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>
            <nav className="px-2 py-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1877f2]/10 text-[#1877f2]'
                        : 'text-gray-700 hover:bg-[#f0f2f5]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-14">
        {/* Cover Banner */}
        <div 
          className="h-32 md:h-40 relative"
          style={{ 
            background: `linear-gradient(135deg, ${group.color || '#1877f2'}, ${group.color || '#1877f2'}88, #36cfc9)` 
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Group Info */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-8 md:-mt-12 pb-4 relative z-10">
              {/* Avatar */}
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl md:text-5xl"
                style={{ backgroundColor: `${group.color || '#1877f2'}20` }}
              >
                {group.icon_emoji || '👥'}
              </div>
              
              {/* Info */}
              <div className="flex-1 pb-1">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{group.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    {group.privacy === 'public' ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    {group.privacy === 'public' ? 'Nhóm công khai' : 'Nhóm riêng tư'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {(group.member_count || 0).toLocaleString()} thành viên
                  </span>
                </div>
              </div>

              {/* Join/Leave Button */}
              <div className="pb-1">
                <button
                  onClick={handleJoinLeave}
                  disabled={isJoining}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-colors ${
                    isMember
                      ? 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-200'
                      : 'bg-[#1877f2] text-white hover:bg-[#1664d9]'
                  }`}
                >
                  {isJoining ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isMember ? (
                    <UserMinus className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {isMember ? 'Rời nhóm' : 'Tham gia'}
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 border-t border-gray-200 -mb-px overflow-x-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-[3px] transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-[#1877f2] border-[#1877f2]'
                        : 'text-gray-600 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Page Content with Sidebar */}
        <div className="max-w-[1100px] mx-auto px-4 py-4">
          <div className="flex gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {children}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-[340px]">
              <div className="sticky top-[200px] space-y-4">
                {/* About */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <h3 className="font-bold text-gray-900 mb-3">Giới thiệu</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {group.about || group.description || 'Chưa có mô tả.'}
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span><strong className="text-gray-900">{(group.member_count || 0).toLocaleString()}</strong> thành viên</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                      <span><strong className="text-gray-900">{group.post_count || 0}</strong> bài viết</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <span><strong className="text-gray-900">{group.course_count || 0}</strong> khóa học</span>
                    </div>
                  </div>
                </motion.div>

                {/* Top Members */}
                {topMembers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <h3 className="font-bold text-gray-900 mb-3">Thành viên nổi bật</h3>
                    <div className="space-y-3">
                      {topMembers.slice(0, 5).map((member: any, index: number) => (
                        <Link
                          key={member.id}
                          href={`/profile/${member.username || member.id}`}
                          className="flex items-center gap-3 hover:bg-[#f0f2f5] p-2 -mx-2 rounded-lg transition-colors"
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg">
                              {getEmojiAvatar(member.full_name)}
                            </div>
                            {index < 3 && (
                              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-sm shadow-sm">
                                {['🥇', '🥈', '🥉'][index]}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {member.full_name || 'Thành viên'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Lv.{getUserLevel(member.points_in_group || member.points || 0)} &bull; {(member.points_in_group || member.points || 0).toLocaleString()} điểm
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/groups/${slug}/leaderboards`}
                      className="block mt-4 text-center text-sm text-[#1877f2] font-medium hover:underline"
                    >
                      Xem tất cả thành viên
                    </Link>
                  </motion.div>
                )}

                {/* Rules */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-[#1877f2]" />
                    <h3 className="font-bold text-gray-900">Nội quy nhóm</h3>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="font-semibold text-gray-900 flex-shrink-0">1.</span>
                      Tôn trọng mọi thành viên
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-gray-900 flex-shrink-0">2.</span>
                      Không spam hoặc quảng cáo
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-gray-900 flex-shrink-0">3.</span>
                      Chia sẻ kiến thức có giá trị
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-gray-900 flex-shrink-0">4.</span>
                      Giúp đỡ thành viên mới
                    </li>
                  </ol>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
