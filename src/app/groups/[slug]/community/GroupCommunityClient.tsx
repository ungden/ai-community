'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Zap,
  MoreHorizontal,
  Image as ImageIcon,
  Send,
  Smile,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Share2
} from 'lucide-react'
import type { Profile, Category, PostWithAuthor } from '@/lib/database.types'

interface GroupCommunityClientProps {
  profile: Profile | null
  categories: Category[]
  initialPosts: PostWithAuthor[]
  groupId: string
  groupName: string
}

interface CommentType {
  id: string
  content: string
  likes: number
  created_at: string
  author: {
    id: string
    full_name: string | null
    avatar_url: string | null
    points: number
    role?: string
  }
  replies?: CommentType[]
}

const EMOJI_AVATARS = ['🧑‍💻', '👨‍💼', '👩‍🎨', '👨‍🔬', '👩‍💻', '🧑‍🎓', '👨‍🏫', '👩‍🔧', '🧑‍🚀', '👨‍🍳']

export default function GroupCommunityClient({
  profile,
  categories,
  initialPosts,
  groupId,
  groupName,
}: GroupCommunityClientProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [newPostContent, setNewPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [comments, setComments] = useState<Record<string, CommentType[]>>({})
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set())
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [replyingTo, setReplyingTo] = useState<{ postId: string; commentId: string; authorName: string } | null>(null)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [likingPost, setLikingPost] = useState<string | null>(null)
  const [likingComment, setLikingComment] = useState<string | null>(null)

  const filteredPosts = posts.filter(post => {
    if (selectedCategory && post.category_id !== selectedCategory) return false
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
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    if (days === 1) return 'Hôm qua'
    if (days < 7) return `${days} ngày trước`
    return d.toLocaleDateString('vi-VN')
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

  const getEmojiAvatar = (name: string | null | undefined) => {
    if (!name) return '👤'
    const index = name.charCodeAt(0) % EMOJI_AVATARS.length
    return EMOJI_AVATARS[index]
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || isPosting) return

    setIsPosting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent,
          category_id: selectedCategory,
          group_id: groupId,
        })
      })

      if (response.ok) {
        const { post } = await response.json()
        setPosts([post, ...posts])
        setNewPostContent('')
      }
    } catch {
      // Error handled silently
    } finally {
      setIsPosting(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (likingPost) return

    setLikingPost(postId)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', id: postId })
      })

      if (response.ok) {
        const { liked } = await response.json()
        if (liked) {
          setLikedPosts(new Set([...likedPosts, postId]))
          setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        } else {
          const newLiked = new Set(likedPosts)
          newLiked.delete(postId)
          setLikedPosts(newLiked)
          setPosts(posts.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
        }
      }
    } catch {
      // Error handled silently
    } finally {
      setLikingPost(null)
    }
  }

  const loadComments = async (postId: string) => {
    if (loadingComments.has(postId)) return

    setLoadingComments(new Set([...loadingComments, postId]))
    try {
      const response = await fetch(`/api/comments?post_id=${postId}`)
      if (response.ok) {
        const { comments: loadedComments } = await response.json()
        setComments({ ...comments, [postId]: loadedComments })
      }
    } catch {
      // Error handled silently
    } finally {
      const newLoading = new Set(loadingComments)
      newLoading.delete(postId)
      setLoadingComments(newLoading)
    }
  }

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
      if (!comments[postId]) {
        loadComments(postId)
      }
    }
    setExpandedComments(newExpanded)
  }

  const handleAddComment = async (postId: string, parentId?: string) => {
    const content = newComment[postId]?.trim()
    if (!content) return

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          content,
          parent_id: parentId || null
        })
      })

      if (response.ok) {
        const { comment } = await response.json()

        if (parentId) {
          setComments({
            ...comments,
            [postId]: comments[postId]?.map(c =>
              c.id === parentId
                ? { ...c, replies: [...(c.replies || []), comment] }
                : c
            ) || []
          })
        } else {
          setComments({
            ...comments,
            [postId]: [...(comments[postId] || []), { ...comment, replies: [] }]
          })
        }
        setNewComment({ ...newComment, [postId]: '' })
        setReplyingTo(null)
      }
    } catch {
      // Error handled silently
    }
  }

  const handleLikeComment = async (commentId: string, postId: string) => {
    if (likingComment) return

    setLikingComment(commentId)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'comment', id: commentId })
      })

      if (response.ok) {
        const { liked } = await response.json()

        if (liked) {
          setLikedComments(new Set([...likedComments, commentId]))
        } else {
          const newLiked = new Set(likedComments)
          newLiked.delete(commentId)
          setLikedComments(newLiked)
        }

        const updateCommentLikes = (commentsList: CommentType[]): CommentType[] => {
          return commentsList.map(c => {
            if (c.id === commentId) {
              return { ...c, likes: liked ? c.likes + 1 : Math.max(0, c.likes - 1) }
            }
            if (c.replies?.length) {
              return { ...c, replies: updateCommentLikes(c.replies) }
            }
            return c
          })
        }

        setComments({
          ...comments,
          [postId]: updateCommentLikes(comments[postId] || [])
        })
      }
    } catch {
      // Error handled silently
    } finally {
      setLikingComment(null)
    }
  }

  const handleReply = (postId: string, commentId: string, authorName: string) => {
    setReplyingTo({ postId, commentId, authorName })
    setNewComment({ ...newComment, [postId]: `@${authorName} ` })
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-[#1877f2] text-white'
                : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#1877f2] text-white'
                  : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Box */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl flex-shrink-0">
            {getEmojiAvatar(profile?.full_name)}
          </div>
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={`Chia sẻ điều gì đó trong ${groupName}...`}
              className="w-full bg-[#f0f2f5] rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20 resize-none min-h-[80px] text-[15px]"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-full hover:bg-[#f0f2f5] text-gray-500 transition-colors" aria-label="Thêm ảnh">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-[#f0f2f5] text-gray-500 transition-colors" aria-label="Thêm emoji">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isPosting}
                className="px-5 py-2 bg-[#1877f2] text-white rounded-lg font-semibold hover:bg-[#1664d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPosting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Đăng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chưa có bài viết nào trong nhóm</p>
          <p className="text-sm text-gray-400 mt-1">
            Hãy là người đầu tiên chia sẻ trong nhóm!
          </p>
        </div>
      ) : (
        filteredPosts.map((post, idx) => {
          const authorLevel = getUserLevel(post.author?.points || 0)
          const isAdmin = post.author?.role === 'admin'
          const isPinned = idx === 0 && post.is_pinned

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Pinned Badge */}
              {isPinned && (
                <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-[#1877f2]">📌</span>
                  Bài viết đã ghim
                </div>
              )}

              {/* Post Header */}
              <div className="p-4 pb-0">
                <div className="flex items-start gap-3">
                  <Link href={`/profile/${post.author?.username || post.author_id}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl">
                      {getEmojiAvatar(post.author?.full_name)}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/profile/${post.author?.username || post.author_id}`}
                        className="font-semibold text-[15px] text-gray-900 hover:underline"
                      >
                        {post.author?.full_name || 'Admin'}
                      </Link>
                      {isAdmin && (
                        <span className="px-1.5 py-0.5 bg-[#1877f2] text-white text-[10px] font-bold rounded">
                          ADMIN
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Lv.{authorLevel} {getLevelName(authorLevel)}
                      </span>
                      {post.required_tier !== 'free' && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-md flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {post.required_tier.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>{post.published_at && formatDate(post.published_at)}</span>
                      {post.category && (
                        <>
                          <span>&bull;</span>
                          <span className="text-[#1877f2]">{post.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-[#f0f2f5] text-gray-500" aria-label="Thêm tùy chọn">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <Link href={canAccessPost(post) ? `/posts/${post.slug}` : '/pricing'}>
                <div className="px-4 py-3">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-[#1877f2] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-[15px] text-gray-700 whitespace-pre-line leading-relaxed line-clamp-4">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Post Image */}
                {post.cover_image && (
                  <div className="relative">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      width={700}
                      height={400}
                      className="w-full max-h-96 object-cover"
                      unoptimized
                    />
                    {!canAccessPost(post) && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Zap className="w-10 h-10 mx-auto mb-2" />
                          <p className="font-semibold">Nội dung {post.required_tier.toUpperCase()}</p>
                          <p className="text-sm text-white/70 mt-1">Nâng cấp để xem</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Link>

              {/* Post Stats */}
              <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="text-sm">👍</span>
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{comments[post.id]?.length || 0} bình luận</span>
                  <span>{post.views} lượt xem</span>
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-4 py-1 border-t border-gray-100 flex">
                <button
                  onClick={() => handleLikePost(post.id)}
                  disabled={likingPost === post.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
                    likedPosts.has(post.id)
                      ? 'text-[#1877f2] bg-[#1877f2]/5'
                      : 'text-gray-600 hover:bg-[#f0f2f5]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">Thích</span>
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:bg-[#f0f2f5] rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Bình luận</span>
                  {expandedComments.has(post.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:bg-[#f0f2f5] rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Chia sẻ</span>
                </button>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {expandedComments.has(post.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50/50 space-y-4">
                      {/* Add Comment */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm flex-shrink-0">
                          {getEmojiAvatar(profile?.full_name)}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                            placeholder="Viết bình luận..."
                            className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1877f2]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id, replyingTo?.postId === post.id ? replyingTo.commentId : undefined)
                              }
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id, replyingTo?.postId === post.id ? replyingTo.commentId : undefined)}
                            disabled={!newComment[post.id]?.trim()}
                            className="px-4 py-2 bg-[#1877f2] text-white rounded-full hover:bg-[#1664d9] disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Gửi bình luận"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Reply indicator */}
                      {replyingTo?.postId === post.id && (
                        <div className="flex items-center gap-2 text-sm text-[#1877f2] bg-[#1877f2]/5 px-3 py-2 rounded-lg">
                          <span>Đang trả lời {replyingTo.authorName}</span>
                          <button
                            onClick={() => {
                              setReplyingTo(null)
                              setNewComment({ ...newComment, [post.id]: '' })
                            }}
                            className="hover:text-[#1664d9]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Comments List */}
                      {loadingComments.has(post.id) ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-6 h-6 animate-spin text-[#1877f2]" />
                        </div>
                      ) : comments[post.id]?.length > 0 ? (
                        <div className="space-y-3">
                          {comments[post.id].map((comment) => {
                            const commentLevel = getUserLevel(comment.author?.points || 0)
                            const isCommentAdmin = comment.author?.role === 'admin'

                            return (
                              <div key={comment.id}>
                                {/* Main comment */}
                                <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm flex-shrink-0">
                                    {getEmojiAvatar(comment.author?.full_name)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-white rounded-2xl px-4 py-2 inline-block">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-gray-900">
                                          {comment.author?.full_name || 'Ẩn danh'}
                                        </span>
                                        {isCommentAdmin && (
                                          <span className="px-1 py-0.5 bg-[#1877f2] text-white text-[9px] font-bold rounded">
                                            ADMIN
                                          </span>
                                        )}
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">
                                          Lv.{commentLevel}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">
                                        {comment.content}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
                                      <span>{formatDate(comment.created_at)}</span>
                                      <button
                                        onClick={() => handleLikeComment(comment.id, post.id)}
                                        disabled={likingComment === comment.id}
                                        className={`font-medium hover:text-[#1877f2] ${likedComments.has(comment.id) ? 'text-[#1877f2]' : ''}`}
                                      >
                                        Thích ({comment.likes})
                                      </button>
                                      <button
                                        onClick={() => handleReply(post.id, comment.id, comment.author?.full_name || 'Ẩn danh')}
                                        className="font-medium hover:text-[#1877f2]"
                                      >
                                        Trả lời
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Nested replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="ml-11 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                                    {comment.replies.map((reply) => {
                                      const replyLevel = getUserLevel(reply.author?.points || 0)
                                      const isReplyAdmin = reply.author?.role === 'admin'

                                      return (
                                        <div key={reply.id} className="flex gap-3">
                                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-xs flex-shrink-0">
                                            {getEmojiAvatar(reply.author?.full_name)}
                                          </div>
                                          <div className="flex-1">
                                            <div className="bg-white rounded-2xl px-3 py-2 inline-block">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-xs text-gray-900">
                                                  {reply.author?.full_name || 'Ẩn danh'}
                                                </span>
                                                {isReplyAdmin && (
                                                  <span className="px-1 py-0.5 bg-[#1877f2] text-white text-[8px] font-bold rounded">
                                                    ADMIN
                                                  </span>
                                                )}
                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] rounded-full">
                                                  Lv.{replyLevel}
                                                </span>
                                              </div>
                                              <p className="text-xs text-gray-700">
                                                {reply.content}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 ml-2 text-xs text-gray-500">
                                              <span>{formatDate(reply.created_at)}</span>
                                              <button
                                                onClick={() => handleLikeComment(reply.id, post.id)}
                                                disabled={likingComment === reply.id}
                                                className={`font-medium hover:text-[#1877f2] ${likedComments.has(reply.id) ? 'text-[#1877f2]' : ''}`}
                                              >
                                                Thích ({reply.likes})
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">
                          Chưa có bình luận nào. Hãy là người đầu tiên!
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })
      )}
    </div>
  )
}
