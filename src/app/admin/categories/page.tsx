import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CategoriesManagement from './CategoriesManagement'

export const metadata = {
  title: 'Quản lý Categories | Admin',
}

export default async function AdminCategoriesPage() {
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

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <CategoriesManagement initialCategories={categories || []} />
  )
}
