import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
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

  // Fetch dashboard stats
  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: totalCourses },
    { count: activeSubscriptions },
    { data: recentPayments },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase
      .from('payments')
      .select(`
        *,
        user:profiles(full_name, email:id)
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Calculate total revenue
  const { data: revenueData } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed') as { data: { amount: number }[] | null }

  const totalRevenue = revenueData?.reduce((sum, p) => sum + p.amount, 0) || 0

  return (
    <AdminDashboard
      stats={{
        totalUsers: totalUsers || 0,
        totalPosts: totalPosts || 0,
        totalCourses: totalCourses || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalRevenue,
      }}
      recentPayments={recentPayments || []}
      recentUsers={recentUsers || []}
    />
  )
}
