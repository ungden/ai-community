import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FALLBACK_GROUPS } from '@/lib/fallback-data'

export default async function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/auth/login')
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if group exists
  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!group) {
    // Try fallback
    const fallbackGroup = FALLBACK_GROUPS.find(g => g.slug === slug)
    if (!fallbackGroup) {
      redirect('/groups')
    }
  }

  // Default tab is community
  redirect(`/groups/${slug}/community`)
}
