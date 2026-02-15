import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get upcoming events
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const includesPast = searchParams.get('past') === 'true'

    let query = supabase
      .from('events')
      .select(`
        *,
        host:profiles(id, full_name, avatar_url)
      `)
      .order('start_time', { ascending: true })
      .limit(limit)

    if (!includesPast) {
      query = query.gte('start_time', new Date().toISOString())
    }

    const { data: events, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    // Get attendee counts for each event
    const eventsWithCounts = await Promise.all(
      (events || []).map(async (event: any) => {
        const { count } = await supabase
          .from('event_attendees')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)
          .eq('status', 'registered')
        
        return { ...event, attendees_count: count || 0 }
      })
    )

    return NextResponse.json({ events: eventsWithCounts })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      event_type, 
      start_time, 
      duration_minutes, 
      location, 
      meeting_url,
      cover_image,
      max_attendees,
      required_tier
    } = body

    if (!title || !start_time) {
      return NextResponse.json({ error: 'Title and start_time are required' }, { status: 400 })
    }

    const eventData = {
      title,
      description: description || null,
      event_type: event_type || 'livestream',
      start_time,
      duration_minutes: duration_minutes || 60,
      location: location || null,
      meeting_url: meeting_url || null,
      cover_image: cover_image || null,
      host_id: user.id,
      max_attendees: max_attendees || null,
      required_tier: required_tier || 'free',
      status: 'scheduled'
    }

    const { data: event, error } = await (supabase as any)
      .from('events')
      .insert(eventData)
      .select(`
        *,
        host:profiles(id, full_name, avatar_url)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
