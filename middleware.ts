// middleware.ts (Root of the repo)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// List the routes that must be signed-in
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/create(.*)",
  "/u(.*)",
  "/api/private/(.*)", // move any private APIs under /api/private/ if needed
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Check if Clerk is properly configured
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      console.error("Clerk environment variables are missing");
      // Allow public routes to work even without Clerk
      if (!isProtectedRoute(req)) {
        return NextResponse.next();
      }
      // For protected routes, redirect to a safe page
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  } catch (error) {
    console.error("Middleware error:", error);
    // For protected routes, redirect to home
    if (isProtectedRoute(req)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // For public routes, continue
    return NextResponse.next();
  }
});

// IMPORTANT: valid Next.js matcher that skips static assets/internal routes
export const config = {
  matcher: [
    // run on everything except _next, static files, and favicons/sitemaps/robots
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
