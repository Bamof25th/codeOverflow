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
  "/questions/:id"
]);

const isIgnoredRoute = createRouteMatcher([
  "/api/webhook", 
  "/api/chatgpt"
]);

export default clerkMiddleware((auth, req) => {
  console.log("Middleware executed for:", req.url);

  // Check current server time
  const currentTime = new Date().toISOString();
  console.log("Current Server Time:", currentTime);

  // Log the entire request URL and method for better debugging
  console.log("Request URL:", req.url);
  console.log("Request Method:", req.method);

  // If the route is public or ignored, skip the protection
  if (isPublicRoute(req)) {
    console.log("Public Route:", req.url);
    return;
  }

  if (isIgnoredRoute(req)) {
    console.log("Ignored Route:", req.url);
    return;
  }

  // Otherwise, protect the route
  console.log("Protected Route, requiring authentication:", req.url);
  auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
