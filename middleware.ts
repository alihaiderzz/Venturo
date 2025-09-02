import { clerkMiddleware } from '@clerk/nextjs/server'

// Run Clerk at the edge, but keep it lightweight: no Node-only libs here
export default clerkMiddleware((auth, req) => {
  // Only add basic security headers that work in Edge runtime
  const response = new Response()
  
  // Edge-safe security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  return response
})

export const config = {
  matcher: [
    // Run on all paths except: _next/static, _next/image, and common static file extensions
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
  // No runtime specified - let Vercel use Edge runtime for middleware
}
