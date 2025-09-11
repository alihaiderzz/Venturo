// middleware.ts - Edge-compatible version
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Simple middleware that just passes through
  // No Clerk imports to avoid Edge Function issues
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|_static|.*\\..*|favicon.ico).*)',
  ],
}
