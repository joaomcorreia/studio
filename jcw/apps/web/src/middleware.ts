import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the hostname from the request
  const hostname = request.headers.get('host') || ''
  
  // Check if it's a subdomain request
  if (hostname.includes('.lvh.me') || hostname.includes('.localhost')) {
    // Extract subdomain (tenant slug)
    const subdomain = hostname.split('.')[0]
    
    // Skip if it's the main domain or www
    if (subdomain === 'www' || subdomain === 'localhost' || subdomain === '127') {
      return NextResponse.next()
    }
    
    // Add tenant info to headers for the app to access
    const response = NextResponse.next()
    response.headers.set('x-tenant-slug', subdomain)
    response.headers.set('x-tenant-domain', hostname)
    
    return response
  }
  
  // For localhost:3000 requests, treat as main platform
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