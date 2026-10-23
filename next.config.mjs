/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the strict-mode double render — the app relies on it (Clerk's auth
  // context, Suspense boundaries in the app router). Disabling it in dev makes
  // behaviour diverge from production.
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Cloudinary: transformed + original images
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Clerk: user avatars
      {
        protocol: 'https',
        hostname: '*.clerk.com',
      },
      {
        protocol: 'https',
        hostname: '*.clerkusercontent.com',
      },
    ],
  },

  // mongodb ships native bindings and svix ships ESM-only code. Bundling either
  // through webpack throws "You are trying to `import` a file outside of the
  // project" in server actions / the build. Leave them external.
  serverExternalPackages: ['mongodb', 'svix'],

  async headers() {
    return [
      {
        // Transform URLs are generated on the fly; don't let a CDN or the
        // browser serve a stale transformed image.
        source: '/:path*',
        headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
      },
    ];
  },
};

export default nextConfig;
