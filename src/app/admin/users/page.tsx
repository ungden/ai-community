import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersManagement from './UsersManagement'

export const metadata = {
  title: 'Quản lý Users | Admin',
}

export default async function AdminUsersPage() {
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

  // Fetch all users with pagination
  const { data: users, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <UsersManagement 
      initialUsers={users || []} 
      totalCount={count || 0}
    />
  )
}
