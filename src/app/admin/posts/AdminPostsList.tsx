'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Brain,
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  CreditCard,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Sun,
  Moon,
  Menu,
  X,
  Filter,
  Zap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { vi } from '@/lib/translations'
import type { Category } from '@/lib/database.types'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  required_tier: string
  views: number
  likes: number
  created_at: string
  published_at: string | null
  author: { full_name: string } | null
  category: { name: string } | null
}

interface AdminPostsListProps {
  initialPosts: Post[]
  categories: Category[]
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: vi.admin.dashboard },
  { href: '/admin/posts', icon: FileText, label: vi.admin.posts },
  { href: '/admin/courses', icon: BookOpen, label: vi.admin.courses },
  { href: '/admin/users', icon: Users, label: vi.admin.users },
  { href: '/admin/subscriptions', icon: CreditCard, label: vi.admin.subscriptions },
]

export default function AdminPostsList({ initialPosts, categories }: AdminPostsListProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [posts, setPosts] = useState(initialPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredPosts = posts.filter(post => {
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (statusFilter !== 'all' && post.status !== statusFilter) return false
    return true
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return

    const supabase = createClient()
    if (!supabase) return
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (!error) {
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500'
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'archived':
        return 'bg-gray-500/10 text-gray-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-light)] transform transition-transform lg:transform-none ${
        showMobileNav ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
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

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === '/admin/posts'
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

          <div className="p-4 border-t border-[var(--border-light)] space-y-1">
            <Link
              href="/community"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            >
              <Eye className="w-5 h-5" />
              Xem trang
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

      {showMobileNav && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileNav(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
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
                {vi.admin.posts}
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
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">{vi.admin.createPost}</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-12 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">{vi.admin.published}</option>
                <option value="draft">{vi.admin.draft}</option>
                <option value="archived">{vi.admin.archived}</option>
              </select>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-light)]">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      Tiêu đề
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)] hidden md:table-cell">
                      Danh mục
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)] hidden lg:table-cell">
                      Tier
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      Trạng thái
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)] hidden sm:table-cell">
                      Views
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-primary)] hidden lg:table-cell">
                      Ngày tạo
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-tertiary)]">
                        Không tìm thấy bài viết nào
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[var(--text-primary)] line-clamp-1">
                              {post.title}
                            </p>
                            <p className="text-sm text-[var(--text-tertiary)]">
                              {post.author?.full_name || 'Unknown'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-[var(--text-secondary)]">
                            {post.category?.name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          {post.required_tier !== 'free' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-md">
                              <Zap className="w-3 h-3" />
                              {post.required_tier.toUpperCase()}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadge(post.status)}`}>
                            {post.status === 'published' ? vi.admin.published :
                             post.status === 'draft' ? vi.admin.draft : vi.admin.archived}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-[var(--text-secondary)]">{post.views}</span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-[var(--text-secondary)]">
                            {formatDate(post.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/posts/${post.slug}`}
                              className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                              target="_blank"
                            >
                              <Eye className="w-4 h-4 text-[var(--text-tertiary)]" />
                            </Link>
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4 text-[var(--text-tertiary)]" />
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
