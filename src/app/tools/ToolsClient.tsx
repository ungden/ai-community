'use client'

import { useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { motion } from 'framer-motion'
import {
  Search,
  Star,
  ExternalLink,
  Check,
  X,
  Filter,
  Sparkles,
  MessageSquare,
  Image,
  Video,
  Music,
  Zap,
  Code,
  FileText
} from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import type { User } from '@supabase/supabase-js'
import type { Profile, Tool } from '@/lib/database.types'

interface ToolsClientProps {
  user: User | null
  profile: Profile | null
  tools: Tool[]
}

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: Sparkles },
  { id: 'llm', name: 'AI Chatbots', icon: MessageSquare },
  { id: 'image', name: 'Image Generation', icon: Image },
  { id: 'video', name: 'Video AI', icon: Video },
  { id: 'audio', name: 'Audio AI', icon: Music },
  { id: 'automation', name: 'Automation', icon: Zap },
  { id: 'coding', name: 'Coding', icon: Code },
  { id: 'writing', name: 'Writing', icon: FileText },
]

const PRICING_FILTERS = [
  { id: 'all', name: 'Tất cả' },
  { id: 'free', name: 'Free' },
  { id: 'freemium', name: 'Freemium' },
  { id: 'paid', name: 'Paid' },
]

export default function ToolsClient({ user, profile, tools }: ToolsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPricing, setSelectedPricing] = useState('all')
  const [expandedTool, setExpandedTool] = useState<string | null>(null)

  const filteredTools = tools.filter(tool => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!tool.name.toLowerCase().includes(query) && 
          !tool.description?.toLowerCase().includes(query)) {
        return false
      }
    }
    
    // Category filter
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
      return false
    }
    
    // Pricing filter
    if (selectedPricing !== 'all' && tool.pricing !== selectedPricing) {
      return false
    }
    
    return true
  })

  const featuredTools = filteredTools.filter(t => t.is_featured)
  const otherTools = filteredTools.filter(t => !t.is_featured)

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'free':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Free</span>
      case 'freemium':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Freemium</span>
      case 'paid':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Paid</span>
      default:
        return null
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category)
    return cat ? cat.icon : Sparkles
  }

  return (
    <MainLayout user={user} profile={profile} showCommunityHeader={false}>
      <div className="bg-[#f0f2f5] min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Tools Catalogue
            </h1>
            <p className="text-gray-600 text-lg">
              Khám phá {tools.length}+ công cụ AI hữu ích cho công việc và cuộc sống
            </p>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 py-6">
          {/* Search & Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f0f2f5] rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1877f2]/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#1877f2] text-white'
                        : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                )
              })}
            </div>

            {/* Pricing Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Giá:</span>
              {PRICING_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedPricing(filter.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedPricing === filter.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Tools */}
          {featuredTools.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Tools nổi bật
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredTools.map((tool, idx) => {
                  const CategoryIcon = getCategoryIcon(tool.category)
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow border-2 border-yellow-100"
                    >
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                          {tool.logo_url ? (
                            <NextImage src={tool.logo_url} alt={tool.name} width={40} height={40} className="w-10 h-10 rounded-lg object-contain" unoptimized />
                          ) : (
                            <CategoryIcon className="w-7 h-7 text-gray-500" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{tool.name}</h3>
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {getPricingBadge(tool.pricing)}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {tool.description}
                          </p>
                          {tool.pricing_detail && (
                            <p className="text-xs text-gray-500 mb-2">{tool.pricing_detail}</p>
                          )}
                          
                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1,2,3,4,5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= Math.round(tool.rating)
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{tool.rating}</span>
                          </div>
                        </div>

                        {/* Action */}
                        <a
                          href={tool.website_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1664d9] transition-colors flex-shrink-0"
                          aria-label={`Mở ${tool.name}`}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>

                      {/* Expandable Details */}
                      <button
                        onClick={() => setExpandedTool(expandedTool === tool.id ? null : tool.id)}
                        className="w-full mt-3 pt-3 border-t border-gray-100 text-sm text-[#1877f2] font-medium hover:underline"
                      >
                        {expandedTool === tool.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                      </button>

                      {expandedTool === tool.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 pt-4 border-t border-gray-100 space-y-4"
                        >
                          {/* Features */}
                          {tool.features && tool.features.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm mb-2">Tính năng chính</h4>
                              <div className="flex flex-wrap gap-2">
                                {tool.features.map((feature, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Use Cases */}
                          {tool.use_cases && tool.use_cases.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm mb-2">Use Cases</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {tool.use_cases.map((useCase, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1877f2]" />
                                    {useCase}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Pros & Cons */}
                          <div className="grid grid-cols-2 gap-4">
                            {tool.pros && tool.pros.length > 0 && (
                              <div>
                                <h4 className="font-medium text-green-700 text-sm mb-2 flex items-center gap-1">
                                  <Check className="w-4 h-4" /> Ưu điểm
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {tool.pros.map((pro, i) => (
                                    <li key={i}>• {pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {tool.cons && tool.cons.length > 0 && (
                              <div>
                                <h4 className="font-medium text-red-700 text-sm mb-2 flex items-center gap-1">
                                  <X className="w-4 h-4" /> Nhược điểm
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {tool.cons.map((con, i) => (
                                    <li key={i}>• {con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Other Tools */}
          {otherTools.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Tất cả Tools ({otherTools.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherTools.map((tool, idx) => {
                  const CategoryIcon = getCategoryIcon(tool.category)
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {/* Logo */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                          {tool.logo_url ? (
                            <NextImage src={tool.logo_url} alt={tool.name} width={32} height={32} className="w-8 h-8 rounded-lg object-contain" unoptimized />
                          ) : (
                            <CategoryIcon className="w-6 h-6 text-gray-500" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{tool.name}</h3>
                            {getPricingBadge(tool.pricing)}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {tool.description}
                          </p>
                        </div>

                        {/* Action */}
                        <a
                          href={tool.website_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-[#1877f2] transition-colors flex-shrink-0"
                          aria-label={`Mở ${tool.name}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.round(tool.rating)
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{tool.rating}</span>
                        {tool.pricing_detail && (
                          <span className="text-xs text-gray-400 ml-auto truncate max-w-[150px]">
                            {tool.pricing_detail}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredTools.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Không tìm thấy tool nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
