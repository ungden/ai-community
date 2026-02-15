import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Register for an event
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

    const body = await request.json()
    const { event_id } = body

    if (!event_id) {
      return NextResponse.json({ error: 'event_id is required' }, { status: 400 })
    }

    // Check if event exists and has space
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single()

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if already registered
    const { data: existingRegistration } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', event_id)
      .eq('user_id', user.id)
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 })
    }

    // Check max attendees
    if ((event as any).max_attendees) {
      const { count } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event_id)
        .eq('status', 'registered')

      if (count && count >= (event as any).max_attendees) {
        return NextResponse.json({ error: 'Event is full' }, { status: 400 })
      }
    }

    // Register
    const { error } = await supabase
      .from('event_attendees')
      .insert({
        event_id,
        user_id: user.id,
        status: 'registered'
      } as any)

    if (error) {
      return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
    }

    return NextResponse.json({ success: true, registered: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Cancel registration
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const event_id = searchParams.get('event_id')

    if (!event_id) {
      return NextResponse.json({ error: 'event_id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('event_attendees')
      .delete()
      .eq('event_id', event_id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to cancel registration' }, { status: 500 })
    }

    return NextResponse.json({ success: true, registered: false })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Check if user is registered for an event
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ registered: false })
    }

    const searchParams = request.nextUrl.searchParams
    const event_id = searchParams.get('event_id')

    if (!event_id) {
      return NextResponse.json({ error: 'event_id is required' }, { status: 400 })
    }

    const { data: registration } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', event_id)
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({ registered: !!registration })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
