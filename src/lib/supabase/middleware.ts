import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

type CookieToSet = { name: string; value: string; options?: CookieOptions }

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, just pass through
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Auth failed, continue without user
  }

  // Protected routes - redirect to login if not authenticated
  // Note: /courses is public (guests can browse, premium content gated on page)
  const protectedPaths = ['/community', '/posts', '/profile', '/admin', '/groups']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Admin routes - require admin role
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Check admin access
  if (isAdminPath && user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as { data: { role: string } | null }

      if (profile?.role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/community'
        return NextResponse.redirect(url)
      }
    } catch {
      // Profile check failed, redirect to community
      const url = request.nextUrl.clone()
      url.pathname = '/community'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/auth/login', '/auth/register']
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname === path)
  
  if (isAuthPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/community'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
