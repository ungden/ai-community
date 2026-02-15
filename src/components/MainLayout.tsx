'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  Calendar,
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
  MessageSquare,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/database.types'

interface MainLayoutProps {
  children: React.ReactNode
  user: User | null
  profile: Profile | null
  communityName?: string
  communityLogo?: string
  showCommunityHeader?: boolean
  memberCount?: number
}

const NAV_ITEMS = [
  { href: '/groups', label: 'Nhóm', icon: Users },
  { href: '/community', label: 'Cộng đồng', icon: MessageSquare },
  { href: '/courses', label: 'Khóa học', icon: BookOpen },
  { href: '/tools', label: 'AI Tools', icon: Sparkles },
  { href: '/calendar', label: 'Lịch', icon: Calendar },
  { href: '/leaderboards', label: 'Xếp hạng', icon: Trophy },
]

export default function MainLayout({ 
  children, 
  user, 
  profile, 
  communityName = 'Alex Le AI',
  communityLogo,
  showCommunityHeader = true,
  memberCount = 1247
}: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/auth/login')
    router.refresh()
  }

  const getUserLevel = (points: number) => {
    if (points >= 33015) return 9
    if (points >= 8015) return 8
    if (points >= 2015) return 7
    if (points >= 515) return 6
    if (points >= 155) return 5
    if (points >= 65) return 4
    if (points >= 20) return 3
    if (points >= 5) return 2
    return 1
  }

  const getLevelName = (level: number) => {
    const names = ['', 'Người mới', 'Thành viên', 'Tích cực', 'Cộng tác viên', 'Chuyên gia', 'Cao cấp', 'Bậc thầy', 'Huyền thoại', 'Siêu sao']
    return names[level] || ''
  }

  const userLevel = profile ? getUserLevel(profile.points) : 1

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo & Community Name */}
            <div className="flex items-center gap-3">
              <Link href="/community" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1877f2] flex items-center justify-center text-xl">
                  🚀
                </div>
                <span className="font-bold text-lg text-gray-900 hidden sm:block">
                  {communityName}
                </span>
              </Link>
            </div>

            {/* Center: Search (Desktop) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trong cộng đồng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
                />
              </div>
            </div>

            {/* Right: Notifications, User */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              {user && (
                <button className="p-2.5 rounded-full bg-[#f0f2f5] hover:bg-gray-200 transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-700" />
                </button>
              )}

              {/* User Menu */}
              {user ? (
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
                        {/* User Info */}
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
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-[#1877f2] text-white rounded-lg font-medium hover:bg-[#1664d9] transition-colors"
                >
                  Đăng nhập
                </Link>
              )}

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
            {/* Mobile Search */}
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
        {/* Community Header with Cover Banner */}
        {showCommunityHeader && (
          <>
            {/* Cover Banner */}
            <div className="bg-gradient-to-r from-[#1877f2] via-[#1890ff] to-[#36cfc9] h-32 md:h-40 relative">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Community Info */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-[1100px] mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-8 md:-mt-12 pb-4 relative z-10">
                  {/* Avatar */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl md:text-5xl">
                    🚀
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 pb-1">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">{communityName}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        Cộng đồng công khai
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {memberCount.toLocaleString()} thành viên
                      </span>
                    </div>
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
          </>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  )
}
