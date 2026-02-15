'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  MessageSquare,
  Lock,
  Globe,
  Crown,
  Search,
  Zap,
  Star,
  ArrowRight,
  Loader2
} from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import { useToast } from '@/components/Toast'
import type { User } from '@supabase/supabase-js'
import type { Profile, Group } from '@/lib/database.types'

interface GroupsClientProps {
  user: User
  profile: Profile | null
  groups: Group[]
  userGroupIds: string[]
  memberCount: number
}

type FilterTab = 'all' | 'featured' | 'joined'

export default function GroupsClient({ 
  user, 
  profile, 
  groups,
  userGroupIds,
  memberCount
}: GroupsClientProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [joiningGroup, setJoiningGroup] = useState<string | null>(null)
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set(userGroupIds))

  const filteredGroups = useMemo(() => {
    let result = groups

    // Filter by tab
    if (activeTab === 'featured') {
      result = result.filter(g => g.is_featured)
    } else if (activeTab === 'joined') {
      result = result.filter(g => joinedGroups.has(g.id))
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(g => 
        g.name.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query)
      )
    }

    return result
  }, [groups, activeTab, searchQuery, joinedGroups])

  const handleJoinGroup = async (groupId: string) => {
    if (joiningGroup) return

    setJoiningGroup(groupId)
    try {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId })
      })

      if (response.ok) {
        const { joined } = await response.json()
        if (joined) {
          setJoinedGroups(new Set([...joinedGroups, groupId]))
        } else {
          const newJoined = new Set(joinedGroups)
          newJoined.delete(groupId)
          setJoinedGroups(newJoined)
        }
      }
    } catch {
      showToast('Không thể tham gia nhóm. Vui lòng thử lại.', 'error')
    } finally {
      setJoiningGroup(null)
    }
  }

  const getTierLabel = (tier: string) => {
    if (tier === 'basic') return 'BASIC'
    if (tier === 'premium') return 'PREMIUM'
    return ''
  }

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'featured', label: 'Nổi bật' },
    { key: 'joined', label: 'Đã tham gia' },
  ]

  return (
    <MainLayout user={user} profile={profile} memberCount={memberCount} showCommunityHeader={false}>
      <div className="max-w-[1100px] mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Khám phá Nhóm</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Tham gia các nhóm để học hỏi và chia sẻ kinh nghiệm AI cùng cộng đồng
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhóm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#1877f2] text-white'
                    : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              {activeTab === 'joined' 
                ? 'Bạn chưa tham gia nhóm nào'
                : 'Không tìm thấy nhóm nào'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {activeTab === 'joined'
                ? 'Khám phá và tham gia các nhóm thú vị!'
                : 'Thử tìm kiếm với từ khóa khác'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group, idx) => {
              const isJoined = joinedGroups.has(group.id)
              const isJoining = joiningGroup === group.id

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Cover Gradient */}
                  <div 
                    className="h-24 relative"
                    style={{ 
                      background: `linear-gradient(135deg, ${group.color || '#1877f2'}, ${group.color || '#1877f2'}88)` 
                    }}
                  >
                    {/* Icon Emoji */}
                    <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl border-2 border-white">
                      {group.icon_emoji || '👥'}
                    </div>

                    {/* Badges in top-right corner */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {group.privacy === 'private' ? (
                        <span className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Riêng tư
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Công khai
                        </span>
                      )}
                      {group.is_featured && (
                        <span className="px-2 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 pt-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-[15px] line-clamp-1">
                        {group.name}
                      </h3>
                      {group.required_tier !== 'free' && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5 flex-shrink-0">
                          <Crown className="w-3 h-3" />
                          {getTierLabel(group.required_tier)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 flex-1">
                      {group.description || 'Chưa có mô tả'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {group.member_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {group.post_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {group.course_count}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      {isJoined ? (
                        <button
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={isJoining}
                          className="flex-1 px-4 py-2 bg-[#f0f2f5] text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {isJoining ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : null}
                          Đã tham gia
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={isJoining}
                          className="flex-1 px-4 py-2 bg-[#1877f2] text-white rounded-lg text-sm font-medium hover:bg-[#1664d9] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {isJoining ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : null}
                          Tham gia
                        </button>
                      )}
                      <Link
                        href={`/groups/${group.slug}`}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-[#f0f2f5] transition-colors flex items-center gap-1.5"
                      >
                        Xem nhóm
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
