import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  // Every authenticated product surface. Unauthenticated visitors are sent to
  // the styled sign-in page instead of seeing an empty shell.
  "/home",
  "/transformations/:path*",
  "/credits",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return;

  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals, static assets, and the Clerk webhook. The webhook
    // is unauthenticated and verifies its own Svix signature, so running
    // clerkMiddleware on it would reject every event Clerk sends.
    //
    // Note: a separate "/(api|trpc)(?!/webhooks/clerk)(.*)" entry looked right
    // but does not parse — Next rejects a matcher segment that begins with "?",
    // so the webhook exclusion lives in this one lookahead instead.
    "/((?!_next|api/webhooks/clerk|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
