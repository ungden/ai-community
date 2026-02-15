'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Brain,
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Image as ImageIcon,
  X,
  Sun,
  Moon
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { vi } from '@/lib/translations'
import type { Category, Post } from '@/lib/database.types'

interface PostEditorProps {
  categories: Category[]
  authorId: string
  post?: Post
}

export default function PostEditor({ categories, authorId, post }: PostEditorProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [coverImage, setCoverImage] = useState(post?.cover_image || '')
  const [categoryId, setCategoryId] = useState(post?.category_id || '')
  const [requiredTier, setRequiredTier] = useState<'free' | 'basic' | 'premium'>(
    (post?.required_tier as 'free' | 'basic' | 'premium') || 'free'
  )
  const [status, setStatus] = useState<'draft' | 'published'>(
    (post?.status as 'draft' | 'published') || 'draft'
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!isEditing || !post?.slug) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết')
      return
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết')
      return
    }

    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Service unavailable. Please try again later.')
        setSaving(false)
        return
      }
      
      const postData = {
        title: title.trim(),
        slug: slug || generateSlug(title),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        cover_image: coverImage || null,
        category_id: categoryId || null,
        author_id: authorId,
        required_tier: requiredTier,
        status: publishNow ? 'published' : status,
        published_at: publishNow ? new Date().toISOString() : post?.published_at,
        updated_at: new Date().toISOString(),
      }

      let error

      if (isEditing && post) {
        const result = await supabase
          .from('posts')
          .update(postData as never)
          .eq('id', post.id)
        error = result.error
      } else {
        const result = await supabase
          .from('posts')
          .insert(postData as never)
        error = result.error
      }

      if (error) {
        if (error.code === '23505') {
          setError('Slug đã tồn tại. Vui lòng chọn slug khác.')
        } else {
          setError(error.message)
        }
        return
      }

      router.push('/admin/posts')
      router.refresh()
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/posts"
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Quay lại</span>
              </Link>
              <div className="h-6 w-px bg-[var(--border-light)]" />
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

              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu nháp'}
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Cập nhật' : 'Xuất bản'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Tiêu đề bài viết..."
                className="w-full text-3xl font-bold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
            </div>

            {/* Excerpt */}
            <div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Mô tả ngắn (hiển thị trong danh sách)..."
                rows={2}
                className="w-full bg-transparent border-none outline-none text-[var(--text-secondary)] placeholder:text-[var(--text-tertiary)] resize-none"
              />
            </div>

            {/* Cover Image */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
              {coverImage ? (
                <div className="relative">
                  <Image
                    src={coverImage}
                    alt="Cover"
                    width={800}
                    height={192}
                    className="w-full h-48 object-cover"
                    unoptimized
                  />
                  <button
                    onClick={() => setCoverImage('')}
                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <label className="flex flex-col items-center gap-3 cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      Thêm ảnh bìa
                    </span>
                    <input
                      type="text"
                      placeholder="Nhập URL ảnh..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full max-w-md px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-primary)]"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border-light)]">
                <span className="text-sm font-medium text-[var(--text-primary)]">Nội dung</span>
                <span className="text-xs text-[var(--text-tertiary)] ml-2">(Hỗ trợ HTML)</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết nội dung bài viết ở đây... (hỗ trợ HTML)"
                rows={20}
                className="w-full p-4 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none font-mono text-sm"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Cài đặt</h3>
              
              <div className="space-y-4">
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-bai-viet"
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Danh mục
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Required Tier */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Yêu cầu gói
                  </label>
                  <select
                    value={requiredTier}
                    onChange={(e) => setRequiredTier(e.target.value as 'free' | 'basic' | 'premium')}
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="free">Miễn phí</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="draft">{vi.admin.draft}</option>
                    <option value="published">{vi.admin.published}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Xem trước</h3>
              <div className="space-y-3">
                {coverImage && (
                  <Image
                    src={coverImage}
                    alt="Preview"
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded-xl"
                    unoptimized
                  />
                )}
                <h4 className="font-medium text-[var(--text-primary)] line-clamp-2">
                  {title || 'Tiêu đề bài viết'}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                  {excerpt || 'Mô tả ngắn...'}
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <span>{categories.find(c => c.id === categoryId)?.name || 'Chưa phân loại'}</span>
                  <span>•</span>
                  <span>{requiredTier.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
