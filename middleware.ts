import { clerkMiddleware } from '@clerk/nextjs/server'

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
    // Run middleware on all routes except Next.js internals and static files
    "/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)",
  ],
};
