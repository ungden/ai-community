import { createClient } from '@/lib/supabase/server'
import ToolsClient from './ToolsClient'
import { FALLBACK_TOOLS } from '@/lib/fallback-data'

export const metadata = {
  title: 'AI Tools Catalogue | Alex Le AI',
  description: 'Danh sách các công cụ AI hữu ích: ChatGPT, Claude, Midjourney, Make, và nhiều hơn nữa.',
}

export default async function ToolsPage() {
  const supabase = await createClient()
  
  let user = null
  let profile = null
  let tools = FALLBACK_TOOLS // Use fallback by default
  
  if (supabase) {
    // Get current user (optional - tools page is public)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = data
    }

    // Get all tools from DB
    const { data: dbTools } = await supabase
      .from('tools')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('order_index', { ascending: true })
    
    // Use DB data if available, otherwise use fallback
    if (dbTools && dbTools.length > 0) {
      tools = dbTools
    }
  }

  return (
    <ToolsClient
      user={user}
      profile={profile}
      tools={tools}
    />
  )
}
