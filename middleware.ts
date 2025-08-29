import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/about',
    '/contact',
    '/legal',
    '/pricing',
    '/browse',
    '/events',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/api/events',
    '/api/get-ideas',
    '/api/clear-ideas',
    '/api/check-table',
    '/api/test-db-columns',
    '/api/test-db-tables',
    '/api/test-delete',
    '/api/test-saved-ideas',
    '/api/upgrade-intent',
    '/api/webhooks/stripe',
    '/api/robots.txt',
    '/api/sitemap.xml',
    '/test',
    '/_next(.*)',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ],
  // Routes that can be accessed while signed out, but also show user content when signed in
  ignoredRoutes: [
    '/api/webhooks(.*)',
    '/api/robots.txt',
    '/api/sitemap.xml'
  ]
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
