import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ToolsManagement from './ToolsManagement'

export const metadata = {
  title: 'Quản lý AI Tools | Admin',
}

export default async function AdminToolsPage() {
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

  // Fetch all tools
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <ToolsManagement initialTools={tools || []} />
  )
}
