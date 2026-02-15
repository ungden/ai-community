'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Brain,
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  UserPlus,
  Crown,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Eye
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { vi } from '@/lib/translations'

interface AdminDashboardProps {
  stats: {
    totalUsers: number
    totalPosts: number
    totalCourses: number
    activeSubscriptions: number
    totalRevenue: number
  }
  recentPayments: Array<{
    id: string
    amount: number
    created_at: string
    user: { full_name: string } | null
  }>
  recentUsers: Array<{
    id: string
    full_name: string | null
    subscription_tier: string
    created_at: string
  }>
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: vi.admin.dashboard },
  { href: '/admin/groups', icon: Users, label: 'Nhóm' },
  { href: '/admin/posts', icon: FileText, label: vi.admin.posts },
  { href: '/admin/courses', icon: BookOpen, label: vi.admin.courses },
  { href: '/admin/categories', icon: FileText, label: 'Categories' },
  { href: '/admin/tools', icon: Brain, label: 'AI Tools' },
  { href: '/admin/events', icon: TrendingUp, label: 'Events' },
  { href: '/admin/users', icon: Users, label: vi.admin.users },
  { href: '/admin/subscriptions', icon: CreditCard, label: vi.admin.subscriptions },
]

export default function AdminDashboard({ stats, recentPayments, recentUsers }: AdminDashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [showMobileNav, setShowMobileNav] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-light)] transform transition-transform lg:transform-none ${
        showMobileNav ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-[var(--border-light)]">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-[var(--text-primary)]">AI Community</span>
                <span className="block text-xs text-[var(--text-tertiary)]">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-[var(--border-light)] space-y-1">
            <Link
              href="/community"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            >
              <Eye className="w-5 h-5" />
              Xem trang chủ
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 w-full"
            >
              <LogOut className="w-5 h-5" />
              {vi.auth.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {showMobileNav && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileNav(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-light)]">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] lg:hidden"
              >
                {showMobileNav ? (
                  <X className="w-5 h-5 text-[var(--text-secondary)]" />
                ) : (
                  <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </button>
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                {vi.admin.dashboard}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
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

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: vi.admin.totalUsers,
                value: stats.totalUsers,
                icon: Users,
                color: 'blue',
              },
              {
                label: vi.admin.totalPosts,
                value: stats.totalPosts,
                icon: FileText,
                color: 'green',
              },
              {
                label: vi.admin.activeSubscriptions,
                value: stats.activeSubscriptions,
                icon: Crown,
                color: 'purple',
              },
              {
                label: vi.admin.totalRevenue,
                value: formatCurrency(stats.totalRevenue),
                icon: DollarSign,
                color: 'orange',
                isRevenue: true,
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                    stat.color === 'green' ? 'bg-green-500/10 text-green-500' :
                    stat.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold text-[var(--text-primary)] ${stat.isRevenue ? 'text-lg' : ''}`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { href: '/admin/posts/new', label: vi.admin.createPost, icon: FileText, color: 'blue' },
              { href: '/admin/courses/new', label: vi.admin.createCourse, icon: BookOpen, color: 'green' },
            ].map((action, idx) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex items-center gap-3 p-4 rounded-xl border border-dashed transition-colors ${
                  action.color === 'blue' 
                    ? 'border-blue-500/30 hover:bg-blue-500/5 text-blue-500' 
                    : 'border-green-500/30 hover:bg-green-500/5 text-green-500'
                }`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]"
            >
              <div className="p-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h2 className="font-semibold text-[var(--text-primary)]">{vi.admin.recentPayments}</h2>
                <Link href="/admin/subscriptions" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                  Xem tất cả
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-[var(--border-light)]">
                {recentPayments.length === 0 ? (
                  <div className="p-8 text-center text-[var(--text-tertiary)]">
                    Chưa có thanh toán nào
                  </div>
                ) : (
                  recentPayments.map((payment) => (
                    <div key={payment.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {payment.user?.full_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-[var(--text-tertiary)]">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                      <span className="font-semibold text-green-500">
                        +{formatCurrency(payment.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Recent Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]"
            >
              <div className="p-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h2 className="font-semibold text-[var(--text-primary)]">{vi.admin.newUsers}</h2>
                <Link href="/admin/users" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                  Xem tất cả
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-[var(--border-light)]">
                {recentUsers.length === 0 ? (
                  <div className="p-8 text-center text-[var(--text-tertiary)]">
                    Chưa có người dùng nào
                  </div>
                ) : (
                  recentUsers.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            {user.full_name || 'Unknown'}
                          </p>
                          <p className="text-sm text-[var(--text-tertiary)]">
                            {formatDate(user.created_at)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.subscription_tier === 'premium'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : user.subscription_tier === 'basic'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}>
                        {user.subscription_tier.toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
