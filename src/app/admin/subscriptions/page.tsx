import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SubscriptionsManagement from './SubscriptionsManagement'

export const metadata = {
  title: 'Quản lý Subscriptions | Admin',
}

export default async function AdminSubscriptionsPage() {
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

  // Fetch subscriptions with user info
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select(`
      *,
      user:profiles(id, full_name, username)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  // Fetch payments
  const { data: payments } = await supabase
    .from('payments')
    .select(`
      *,
      user:profiles(id, full_name, username)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  // Stats
  const { count: activeCount } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { data: revenueData } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed') as { data: { amount: number }[] | null }

  const totalRevenue = revenueData?.reduce((sum, p) => sum + p.amount, 0) || 0

  return (
    <SubscriptionsManagement 
      subscriptions={subscriptions || []} 
      payments={payments || []}
      stats={{
        activeSubscriptions: activeCount || 0,
        totalRevenue,
      }}
    />
  )
}
