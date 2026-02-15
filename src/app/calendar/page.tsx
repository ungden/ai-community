import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarClient from './CalendarClient'
import { FALLBACK_EVENTS } from '@/lib/fallback-data'

export const metadata = {
  title: 'Lịch sự kiện | Alex Le AI',
  description: 'Lịch livestream, workshop và meetup của cộng đồng Alex Le AI. Đăng ký tham gia các sự kiện AI miễn phí.',
}

export default async function CalendarPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/auth/login')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch upcoming events
  const { data: dbEvents } = await supabase
    .from('events')
    .select(`
      *,
      host:profiles(id, full_name, avatar_url)
    `)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(20)

  let eventsWithCounts: any[] = []

  if (dbEvents && dbEvents.length > 0) {
    // Get attendee counts for real events
    eventsWithCounts = await Promise.all(
      dbEvents.map(async (event: any) => {
        const { count } = await supabase
          .from('event_attendees')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)
        
        // Check if current user is registered
        const { data: userRegistration } = await supabase
          .from('event_attendees')
          .select('*')
          .eq('event_id', event.id)
          .eq('user_id', user.id)
          .single()
        
        return { 
          ...event, 
          attendees_count: count || 0,
          is_registered: !!userRegistration
        }
      })
    )
  } else {
    // Use fallback events
    eventsWithCounts = FALLBACK_EVENTS.map(event => ({
      ...event,
      attendees_count: Math.floor(Math.random() * 50) + 10,
      is_registered: false,
      host: { id: '1', full_name: 'Alex Le', avatar_url: null }
    })) as any
  }

  return (
    <CalendarClient
      user={user}
      profile={profile}
      initialEvents={eventsWithCounts}
    />
  )
}
