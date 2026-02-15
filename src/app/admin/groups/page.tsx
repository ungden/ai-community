import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GroupsManagement from './GroupsManagement'

export const metadata = {
  title: 'Quản lý Nhóm | Admin',
}

export default async function AdminGroupsPage() {
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

  // Fetch all groups with owner info
  const { data: groups } = await supabase
    .from('groups')
    .select(`
      *,
      owner:profiles(full_name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  return (
    <GroupsManagement initialGroups={groups || []} userId={user.id} />
  )
}
