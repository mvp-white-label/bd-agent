import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/auth-redirect', '/test', '/api/auth/callback', '/api/auth/logout', '/api/test-supabase', '/api/setup-database', '/api/check-user']
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const user = await getUserFromToken(request)

  // If not authenticated, redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Check if trying to access dashboard without approval
  if (pathname.startsWith('/dashboard') && !user.isApproved) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('status', 'not_approved')
    return NextResponse.redirect(loginUrl)
  }

      // Check if trying to access welcome page without approval
      if (pathname === '/welcome' && !user.isApproved) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('status', 'not_approved')
        return NextResponse.redirect(loginUrl)
      }

      // Check if trying to access profile page without approval
      if (pathname === '/profile' && !user.isApproved) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('status', 'not_approved')
        return NextResponse.redirect(loginUrl)
      }

      // Check if trying to access notifications page without approval
      if (pathname === '/notifications' && !user.isApproved) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('status', 'not_approved')
        return NextResponse.redirect(loginUrl)
      }

      // Check if trying to access pricing page without approval
      if (pathname === '/pricing' && !user.isApproved) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('status', 'not_approved')
        return NextResponse.redirect(loginUrl)
      }

  // Check if trying to access pending-approval page - redirect to login with status
  if (pathname === '/pending-approval') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('status', 'not_approved')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
