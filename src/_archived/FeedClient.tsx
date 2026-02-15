'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Brain,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Settings,
  Crown,
  FileText,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Zap,
  Heart,
  Eye,
  Clock,
  Menu,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { vi } from '@/lib/translations'
import type { User } from '@supabase/supabase-js'
import type { Profile, Category, PostWithAuthor } from '@/lib/database.types'

interface FeedClientProps {
  user: User
  profile: Profile | null
  categories: Category[]
  initialPosts: PostWithAuthor[]
}

export default function FeedClient({ user, profile, categories, initialPosts }: FeedClientProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [posts] = useState(initialPosts)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
    router.refresh()
  }

  const filteredPosts = posts.filter(post => {
    if (selectedCategory && post.category_id !== selectedCategory) return false
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const canAccessPost = (post: PostWithAuthor) => {
    if (post.required_tier === 'free') return true
    if (!profile) return false
    const tierHierarchy = { free: 0, basic: 1, premium: 2 }
    return tierHierarchy[profile.subscription_tier] >= tierHierarchy[post.required_tier]
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Hôm nay'
    if (days === 1) return 'Hôm qua'
    if (days < 7) return `${days} ngày trước`
    return d.toLocaleDateString('vi-VN')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/feed" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)] hidden sm:block">
                AI Community
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={vi.common.search}
                  className="w-full pl-12 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
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

              {/* Notifications */}
              <button className="p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors relative">
                <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-[var(--border-light)]">
                      <p className="font-medium text-[var(--text-primary)]">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-[var(--text-tertiary)]">{user.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          profile?.subscription_tier === 'premium' 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                            : profile?.subscription_tier === 'basic'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                        }`}>
                          {profile?.subscription_tier === 'premium' && <Crown className="w-3 h-3 inline mr-1" />}
                          {profile?.subscription_tier?.toUpperCase() || 'FREE'}
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      >
                        <UserIcon className="w-5 h-5" />
                        {vi.profile.myProfile}
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      >
                        <Settings className="w-5 h-5" />
                        {vi.nav.settings}
                      </Link>
                      {profile?.subscription_tier === 'free' && (
                        <Link
                          href="/pricing"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-yellow-500"
                        >
                          <Crown className="w-5 h-5" />
                          {vi.subscription.upgrade}
                        </Link>
                      )}
                      {profile?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                        >
                          <Settings className="w-5 h-5" />
                          {vi.nav.admin}
                        </Link>
                      )}
                    </div>
                    <div className="p-2 border-t border-[var(--border-light)]">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-red-500 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        {vi.auth.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors md:hidden"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-[var(--text-secondary)]" />
                ) : (
                  <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute top-16 left-0 right-0 bg-[var(--bg-primary)] border-b border-[var(--border-light)] p-4">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={vi.common.search}
                className="w-full pl-12 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
            </div>
            <nav className="space-y-1">
              <Link href="/feed" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="w-5 h-5" />
                {vi.nav.feed}
              </Link>
              <Link href="/courses" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                <BookOpen className="w-5 h-5" />
                {vi.nav.courses}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* User Card */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        {profile?.points || 0} {vi.profile.points}
                      </p>
                    </div>
                  </div>
                  
                  {profile?.subscription_tier === 'free' && (
                    <Link
                      href="/pricing"
                      className="block w-full py-2.5 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      <Crown className="w-4 h-4 inline mr-2" />
                      Nâng cấp Premium
                    </Link>
                  )}
                </div>

                {/* Navigation */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-2 border border-[var(--border-light)]">
                  <nav className="space-y-1">
                    <Link href="/feed" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-500/10 text-blue-500 font-medium">
                      <FileText className="w-5 h-5" />
                      {vi.nav.feed}
                    </Link>
                    <Link href="/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                      <BookOpen className="w-5 h-5" />
                      {vi.nav.courses}
                    </Link>
                  </nav>
                </div>

                {/* Categories */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-light)]">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-3">Danh mục</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                        !selectedCategory 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {vi.categories.all}
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              {/* Category Pills - Mobile */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? 'bg-blue-500 text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                  }`}
                >
                  {vi.categories.all}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Posts */}
              {filteredPosts.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-12 text-center border border-[var(--border-light)]">
                  <FileText className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)]">{vi.posts.noPostsFound}</p>
                </div>
              ) : (
                filteredPosts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-light)] hover:shadow-lg transition-all"
                  >
                    <Link href={canAccessPost(post) ? `/posts/${post.slug}` : '/pricing'}>
                      {post.cover_image && (
                        <div className="relative h-48 bg-[var(--bg-tertiary)]">
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {!canAccessPost(post) && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-center text-white">
                                <Zap className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-medium">Nội dung Premium</p>
                              </div>
                            </div>
                          )}
                          {post.required_tier !== 'free' && (
                            <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-md flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {post.required_tier.toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-5">
                        {post.category && (
                          <div className="text-sm text-blue-500 font-medium mb-2">
                            {post.category.name}
                          </div>
                        )}
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2 line-clamp-2 hover:text-blue-500 transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-[var(--text-secondary)] line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                              {post.author?.full_name?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">
                                {post.author?.full_name || 'Admin'}
                              </p>
                              <p className="text-xs text-[var(--text-tertiary)]">
                                {post.published_at && formatDate(post.published_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Trending */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-light)]">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Xu hướng</h3>
                  </div>
                  <div className="space-y-3">
                    {posts.slice(0, 5).map((post, idx) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.slug}`}
                        className="flex items-start gap-3 group"
                      >
                        <span className="text-2xl font-bold text-[var(--text-tertiary)]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-blue-500 transition-colors">
                            {post.title}
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">
                            {post.views} lượt xem
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Upgrade CTA */}
                {profile?.subscription_tier === 'free' && (
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-500/20">
                    <Crown className="w-8 h-8 text-yellow-500 mb-3" />
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                      Mở khóa tất cả nội dung
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      Nâng cấp lên Premium để truy cập tất cả bài viết và khóa học.
                    </p>
                    <Link
                      href="/pricing"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Xem bảng giá
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
