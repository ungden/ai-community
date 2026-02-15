'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  MessageSquare,
  BookOpen
} from 'lucide-react'
import { getUserLevel } from '@/lib/gamification'
import type { Profile } from '@/lib/database.types'

interface CommunitySidebarProps {
  memberCount?: number
  onlineCount?: number
  postCount?: number
  courseCount?: number
  about?: string
  rules?: string[]
  topMembers?: Profile[]
  isPrivate?: boolean
}

export default function CommunitySidebar({
  memberCount = 0,
  onlineCount = 0,
  postCount = 0,
  courseCount = 0,
  about = 'Cộng đồng học AI cho người đi làm. Chia sẻ case study thực tế về ChatGPT, Claude, Midjourney, Make và các AI tools khác.',
  rules = [
    'Tôn trọng mọi thành viên',
    'Không spam hoặc quảng cáo',
    'Chia sẻ kiến thức có giá trị',
    'Giúp đỡ thành viên mới'
  ],
  topMembers = [],
  isPrivate = false
}: CommunitySidebarProps) {
  
  const getEmojiAvatar = (name: string | null | undefined) => {
    if (!name) return '👤'
    const code = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return ['🧑‍💻', '👨‍💼', '👩‍🎨', '👨‍🔬', '👩‍💻', '🧑‍🎓', '👨‍🏫', '👩‍🔧', '🧑‍🚀', '👨‍🍳'][code % 10]
  }

  return (
    <aside className="space-y-4">
      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-4"
      >
        <h3 className="font-bold text-gray-900 mb-3">Giới thiệu</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {about}
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <Users className="w-5 h-5 text-gray-400" />
            <span><strong className="text-gray-900">{memberCount.toLocaleString()}</strong> thành viên</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <span><strong className="text-gray-900">{postCount}</strong> bài viết</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <BookOpen className="w-5 h-5 text-gray-400" />
            <span><strong className="text-gray-900">{courseCount}</strong> khóa học</span>
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Thành viên nổi bật</h3>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {onlineCount} trực tuyến
            </span>
          </div>
          <div className="space-y-3">
            {topMembers.slice(0, 5).map((member, index) => (
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
                    Lv.{getUserLevel(member.points)} • {member.points.toLocaleString()} điểm
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/leaderboards"
            className="block mt-4 text-center text-sm text-[#1877f2] font-medium hover:underline"
          >
            Xem tất cả thành viên
          </Link>
        </motion.div>
      )}

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#1877f2] to-[#1664d9] rounded-lg shadow-sm p-5 text-white"
      >
        <h3 className="font-bold text-lg mb-2">Nâng cấp Premium</h3>
        <ul className="text-sm space-y-2 mb-4 text-blue-100">
          <li className="flex items-center gap-2">
            <span>✓</span> Truy cập tất cả khóa học
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Nội dung độc quyền
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Hỗ trợ ưu tiên 1-1
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Live Q&A hàng tuần
          </li>
        </ul>
        <Link
          href="/pricing"
          className="block w-full py-2.5 bg-white text-[#1877f2] font-semibold rounded-lg text-center hover:bg-blue-50 transition-colors"
        >
          Xem bảng giá
        </Link>
      </motion.div>
    </aside>
  )
}
