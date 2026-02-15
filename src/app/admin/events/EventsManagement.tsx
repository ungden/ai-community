'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
  X,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Event, ContentStatus } from '@/lib/database.types'

interface EventsManagementProps {
  initialEvents: Event[]
  currentUserId: string
}

const EVENT_TYPES = [
  { value: 'livestream', label: 'Livestream', icon: '🎬' },
  { value: 'workshop', label: 'Workshop', icon: '🛠️' },
  { value: 'webinar', label: 'Webinar', icon: '📺' },
  { value: 'meetup', label: 'Meetup', icon: '🤝' },
  { value: 'qna', label: 'Q&A Session', icon: '❓' },
]

const STATUSES: { value: ContentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export default function EventsManagement({ initialEvents, currentUserId }: EventsManagementProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    if (!editingEvent?.title) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tiêu đề' })
      return
    }

    setLoading(true)
    setMessage(null)

    const supabase = createClient()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Không thể kết nối database' })
      setLoading(false)
      return
    }

    const eventData = {
      title: editingEvent.title,
      description: editingEvent.description || null,
      event_type: editingEvent.event_type || 'livestream',
      start_time: editingEvent.start_time || new Date().toISOString(),
      duration_minutes: editingEvent.duration_minutes || 60,
      location: editingEvent.location || null,
      meeting_url: editingEvent.meeting_url || null,
      max_attendees: editingEvent.max_attendees || null,
      status: editingEvent.status || 'draft',
      host_id: currentUserId,
    }

    if (isCreating) {
      const { data, error } = await (supabase as any)
        .from('events')
        .insert(eventData)
        .select()
        .single()

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setEvents([data, ...events])
        setMessage({ type: 'success', text: 'Tạo event thành công!' })
        setEditingEvent(null)
        setIsCreating(false)
      }
    } else if (editingEvent.id) {
      const { error } = await (supabase as any)
        .from('events')
        .update(eventData)
        .eq('id', editingEvent.id)

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...eventData } as Event : e))
        setMessage({ type: 'success', text: 'Cập nhật thành công!' })
        setEditingEvent(null)
      }
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa event này?')) return

    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Không thể kết nối database' })
      setLoading(false)
      return
    }

    const { error } = await (supabase as any)
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setEvents(events.filter(e => e.id !== id))
      setMessage({ type: 'success', text: 'Xóa thành công!' })
    }

    setLoading(false)
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isPast = (dateStr: string) => new Date(dateStr) < new Date()

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quản lý Events</h1>
                <p className="text-sm text-gray-500">{events.length} events</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCreating(true)
                setEditingEvent({ 
                  event_type: 'livestream', 
                  status: 'draft',
                  duration_minutes: 60,
                  start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
                })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1664d9]"
            >
              <Plus className="w-4 h-4" />
              Thêm event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500">
            Chưa có event nào
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`bg-white rounded-lg shadow-sm overflow-hidden ${isPast(event.start_time) ? 'opacity-60' : ''}`}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {EVENT_TYPES.find(t => t.value === event.event_type)?.icon || '📅'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {event.status}
                      </span>
                      {isPast(event.start_time) && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600">
                          Đã qua
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                      {event.description || 'Chưa có mô tả'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateTime(event.start_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.duration_minutes} phút
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      )}
                      {event.meeting_url && (
                        <a 
                          href={event.meeting_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-500 hover:underline"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Link tham gia
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setIsCreating(false)
                        setEditingEvent({
                          ...event,
                          start_time: event.start_time.slice(0, 16)
                        })
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {isCreating ? 'Tạo Event mới' : 'Chỉnh sửa Event'}
              </h2>
              <button 
                onClick={() => {
                  setEditingEvent(null)
                  setIsCreating(false)
                }} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="VD: Weekly Q&A Session"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại event</label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setEditingEvent({ ...editingEvent, event_type: type.value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        editingEvent.event_type === type.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Time & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={editingEvent.start_time?.slice(0, 16) || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, start_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={editingEvent.duration_minutes || 60}
                    onChange={(e) => setEditingEvent({ ...editingEvent, duration_minutes: parseInt(e.target.value) || 60 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Meeting URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link tham gia</label>
                <input
                  type="url"
                  value={editingEvent.meeting_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, meeting_url: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm (nếu có)</label>
                <input
                  type="text"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  placeholder="VD: Online / Quận 1, HCM"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <div className="flex gap-2">
                  {STATUSES.map(status => (
                    <button
                      key={status.value}
                      onClick={() => setEditingEvent({ ...editingEvent, status: status.value })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editingEvent.status === status.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditingEvent(null)
                    setIsCreating(false)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1664d9] disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
