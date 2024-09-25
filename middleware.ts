import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define route matchers for public and ignored routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook",
  "/question/:id",
  "/tags",
  "/tags/:id",
  "/profile/:id",
  "/community",
  "/jobs",
  "/questions/:id",
]);

const isIgnoredRoute = createRouteMatcher(["/api/webhook", "/api/chatgpt"]);

export default clerkMiddleware((auth, req) => {
  // If the route is public or ignored, skip the protection
  if (isPublicRoute(req)) {
    return;
  }

  if (isIgnoredRoute(req)) {
    return;
  }
  // Otherwise, protect the route
  auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
