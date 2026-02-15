'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import DOMPurify from 'dompurify'
import { motion } from 'framer-motion'
import {
  Brain,
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Eye,
  Calendar,
  Zap,
  Crown,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Check
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { vi } from '@/lib/translations'
import type { User } from '@supabase/supabase-js'
import type { Profile, PostWithAuthor } from '@/lib/database.types'

interface PostDetailClientProps {
  post: PostWithAuthor
  user: User | null
  profile: Profile | null
  canAccess: boolean
  hasLiked: boolean
  relatedPosts: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    cover_image: string | null
    required_tier: string
    views: number
    category: { name: string } | null
  }>
}

export default function PostDetailClient({
  post,
  user,
  profile,
  canAccess,
  hasLiked: initialHasLiked,
  relatedPosts
}: PostDetailClientProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [liked, setLiked] = useState(initialHasLiked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLike = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const supabase = createClient()
    if (!supabase) return
    
    if (liked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', post.id)
      setLikesCount(prev => prev - 1)
    } else {
      await supabase
        .from('post_likes')
        .insert({ user_id: user.id, post_id: post.id } as never)
      setLikesCount(prev => prev + 1)
    }
    setLiked(!liked)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(post.content, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'code', 'pre', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div', 'figure', 'figcaption', 'video', 'source'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'width', 'height', 'controls', 'type'],
      ALLOW_DATA_ATTR: false,
    })
  }, [post.content])

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
              <span className="text-lg font-bold text-[var(--text-primary)] hidden sm:block">
                AI Community
              </span>
            </Link>

            <div className="flex items-center gap-2">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          {/* Category & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Link
                  href={`/posts?category=${post.category.slug}`}
                  className="text-sm font-medium text-blue-500 hover:text-blue-600"
                >
                  {post.category.name}
                </Link>
              )}
              {post.required_tier !== 'free' && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-md flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {post.required_tier.toUpperCase()}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-6">
              {post.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                  {post.author?.full_name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    {post.author?.full_name || 'Admin'}
                  </p>
                </div>
              </div>
              <span className="text-[var(--text-tertiary)]">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.published_at && formatDate(post.published_at)}
              </div>
              <span className="text-[var(--text-tertiary)]">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {estimateReadTime(post.content)} phút đọc
              </div>
              <span className="text-[var(--text-tertiary)]">•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views} lượt xem
              </div>
            </div>
          </motion.div>

          {/* Cover Image */}
          {post.cover_image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden mb-8"
            >
              <Image
                src={post.cover_image}
                alt={post.title}
                width={900}
                height={500}
                className="w-full aspect-video object-cover"
                unoptimized
              />
            </motion.div>
          )}

          {/* Content */}
          {canAccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-blue-500 prose-strong:text-[var(--text-primary)] prose-code:text-[var(--text-primary)] prose-code:bg-[var(--bg-secondary)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Preview Content */}
              {post.excerpt && (
                <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                  <p className="text-[var(--text-secondary)]">{post.excerpt}</p>
                </div>
              )}

              {/* Premium Lock */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 sm:p-12 text-center border border-[var(--border-light)]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                    {vi.posts.premiumLock.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                    {vi.posts.premiumLock.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {!user ? (
                      <>
                        <Link
                          href="/auth/login"
                          className="w-full sm:w-auto px-6 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-primary)] transition-colors"
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          href="/auth/register"
                          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                          Đăng ký miễn phí
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/pricing"
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Crown className="w-5 h-5" />
                        {vi.posts.premiumLock.cta}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mt-8 pt-8 border-t border-[var(--border-light)]"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  liked
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Chia se</span>
                </button>

                {showShareMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl shadow-xl overflow-hidden">
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                    >
                      <Twitter className="w-5 h-5" />
                      Twitter
                    </button>
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                    >
                      <Facebook className="w-5 h-5" />
                      Facebook
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
                      {copied ? 'Da sao chep!' : 'Sao chep link'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Author Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)]"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {post.author?.full_name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)] text-lg">
                  {post.author?.full_name || 'Admin'}
                </p>
                <p className="text-[var(--text-secondary)] mt-1">
                  {post.author?.bio || 'Tac gia tai AI Community'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                {vi.posts.relatedPosts}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/posts/${relatedPost.slug}`}
                    className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-light)] hover:shadow-lg transition-all group"
                  >
                    {relatedPost.cover_image && (
                      <div className="relative h-32 bg-[var(--bg-tertiary)]">
                        <Image
                          src={relatedPost.cover_image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                        {relatedPost.required_tier !== 'free' && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-md">
                            <Zap className="w-3 h-3 inline" />
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-blue-500 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-[var(--text-tertiary)] mt-2">
                        {relatedPost.views} lượt xem
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </article>
      </main>
    </div>
  )
}
