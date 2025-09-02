// middleware.ts (Root of the repo)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// List the routes that must be signed-in
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/create(.*)",
  "/u(.*)",
  "/api/private/(.*)", // move any private APIs under /api/private/ if needed
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// IMPORTANT: valid Next.js matcher that skips static assets/internal routes
export const config = {
  matcher: [
    // run on everything except _next, static files, and favicons/sitemaps/robots
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
