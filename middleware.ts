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
    // protect everything except static files and public assets
    "/((?!_next|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};