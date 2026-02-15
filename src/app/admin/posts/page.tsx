import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminPostsList from './AdminPostsList'

export default async function AdminPostsPage() {
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

  // Fetch posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(full_name),
      category:categories(name)
    `)
    .order('created_at', { ascending: false })

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order_index')

  return (
    <AdminPostsList 
      initialPosts={posts || []} 
      categories={categories || []}
    />
  )
}
