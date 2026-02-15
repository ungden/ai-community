'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2
} from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import { useToast } from '@/components/Toast'
import type { User } from '@supabase/supabase-js'
import type { Profile, EventWithHost } from '@/lib/database.types'

interface EventWithRegistration extends EventWithHost {
  is_registered?: boolean
}

interface CalendarClientProps {
  user: User
  profile: Profile | null
  initialEvents?: EventWithRegistration[]
}

export default function CalendarClient({ user, profile, initialEvents = [] }: CalendarClientProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState(initialEvents)
  const [registering, setRegistering] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    const days: (number | null)[] = []
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'livestream': return 'bg-red-500'
      case 'workshop': return 'bg-[#1877f2]'
      case 'meetup': return 'bg-green-500'
      case 'webinar': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'livestream': return 'Livestream'
      case 'workshop': return 'Workshop'
      case 'meetup': return 'Meetup'
      case 'webinar': return 'Webinar'
      default: return 'Sự kiện'
    }
  }

  const handleRegister = async (eventId: string, isRegistered: boolean) => {
    setRegistering(eventId)
    try {
      if (isRegistered) {
        // Cancel registration
        const response = await fetch(`/api/events/register?event_id=${eventId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setEvents(events.map(e => 
            e.id === eventId 
              ? { ...e, is_registered: false, attendees_count: (e.attendees_count || 1) - 1 }
              : e
          ))
        }
      } else {
        // Register
        const response = await fetch('/api/events/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: eventId })
        })
        if (response.ok) {
          setEvents(events.map(e => 
            e.id === eventId 
              ? { ...e, is_registered: true, attendees_count: (e.attendees_count || 0) + 1 }
              : e
          ))
        }
      }
    } catch {
      showToast('Không thể đăng ký sự kiện. Vui lòng thử lại.', 'error')
    } finally {
      setRegistering(null)
    }
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  return (
    <MainLayout user={user} profile={profile} showCommunityHeader={false}>
      <div className="bg-[#f0f2f5] min-h-screen">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Lịch sự kiện
            </h1>
            <p className="text-gray-600">
              Các buổi livestream, workshop và meetup của cộng đồng
            </p>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm p-5">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
                    aria-label="Tháng trước"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="font-semibold text-gray-900 capitalize">
                    {formatMonth(currentMonth)}
                  </h2>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
                    aria-label="Tháng sau"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const isToday = day === new Date().getDate() && 
                      currentMonth.getMonth() === new Date().getMonth() &&
                      currentMonth.getFullYear() === new Date().getFullYear()
                    
                    const hasEvent = day && events.some(event => {
                      const eventDate = new Date(event.start_time)
                      return eventDate.getDate() === day &&
                        eventDate.getMonth() === currentMonth.getMonth() &&
                        eventDate.getFullYear() === currentMonth.getFullYear()
                    })

                    return (
                      <button
                        key={index}
                        disabled={!day}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative ${
                          day
                            ? isToday
                              ? 'bg-[#1877f2] text-white font-bold'
                              : 'hover:bg-[#f0f2f5] text-gray-900'
                            : ''
                        }`}
                      >
                        {day}
                        {hasEvent && (
                          <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Chú thích</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-600">Livestream</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-[#1877f2]" />
                    <span className="text-gray-600">Workshop</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Meetup</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-gray-600">Webinar</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Events List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              <h2 className="font-semibold text-gray-900">Sự kiện sắp tới</h2>
              
              {events.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Chưa có sự kiện nào sắp tới</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Hãy quay lại sau để xem các sự kiện mới
                  </p>
                </div>
              ) : (
                events.map((event, idx) => {
                  const eventDate = new Date(event.start_time)
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {/* Event Date Card */}
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="bg-[#1877f2]/10 rounded-xl p-2">
                            <p className="text-2xl font-bold text-[#1877f2]">
                              {eventDate.getDate()}
                            </p>
                            <p className="text-xs text-gray-500 uppercase">
                              {eventDate.toLocaleDateString('vi-VN', { month: 'short' })}
                            </p>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getEventTypeColor(event.event_type)}`}>
                              {getEventTypeLabel(event.event_type)}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {event.title}
                          </h3>
                          
                          {event.description && (
                            <p className="text-sm text-gray-600 mb-3">
                              {event.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {eventDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} 
                                ({event.duration_minutes} phút)
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees_count || 0} đã đăng ký</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.meeting_url && (
                              <div className="flex items-center gap-1 text-red-500">
                                <Video className="w-4 h-4" />
                                <span>Online</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => handleRegister(event.id, event.is_registered || false)}
                          disabled={registering === event.id}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            event.is_registered
                              ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                              : 'bg-[#1877f2] text-white hover:bg-[#1664d9]'
                          }`}
                        >
                          {registering === event.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : event.is_registered ? (
                            <>
                              <Check className="w-4 h-4" />
                              Đã đăng ký
                            </>
                          ) : (
                            'Tham gia'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
