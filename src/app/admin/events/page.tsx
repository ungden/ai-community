import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EventsManagement from './EventsManagement'

export const metadata = {
  title: 'Quản lý Events | Admin',
}

export default async function AdminEventsPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/auth/login')
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null }

  if (profile?.role !== 'admin') {
    redirect('/community')
  }

  // Fetch all events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: false })

  return (
    <EventsManagement initialEvents={events || []} currentUserId={user.id} />
  )
}
