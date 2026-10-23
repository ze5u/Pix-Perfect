import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

// Clerk validates the publishable key at render time. Marking the layout as
// dynamic prevents Next.js from prerendering any page (including /_not-found)
// with a placeholder key during `next build`.
export const dynamic = "force-dynamic";

// Manrope is the single face for the whole site — app and marketing share it,
// so there is no second type system to drift. It carries the weight range the
// visual rules allow (up to bold) without needing a 900 cut.
const ManropeFace = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Reused so Clerk's auth UI shares the same colours, radii and hairlines as
// the landing. The card background is kept on paper to match the app shell,
// the input background is white to differentiate it, and the 16px input
// radius aligns with the 20px field corners in globals.css.
const clerkVariables = {
  colorPrimary: "#07070b", // ink-950 — the site's action colour
  colorPrimaryDark: "#1a1a22", // ink-800
  colorPrimaryLight: "#6b6b80", // ink-500
  colorBackground: "#ffffff", // paper
  colorText: "#07070b",
  colorTextOnPrimary: "#ffffff",
  colorTextSecondary: "#6b6b80",
  colorTextDim: "#8d8da0",
  colorInputBackground: "#ffffff",
  colorInputText: "#07070b",
  colorInputBorder: "#07070b", // hairline border language
  colorDanger: "#f0432a",
  borderRadius: "12px",
  fontSizeSmall: "14px",
  fontSizeRegular: "16px",
  fontSizeLarge: "18px",
};

export const metadata: Metadata = {
  title: {
    default: "PixPerfect — fix any photo with one upload",
    template: "%s — PixPerfect",
  },
  description:
    "Restore a scratched family photo, fill the edges out, remove a passerby, recolor an object, cut out the background. Five edits, one credit each, 20 to start.",
  applicationName: "PixPerfect",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pixperfect.app"),
  keywords: [
    "image editor",
    "AI",
    "photo restoration",
    "generative fill",
    "remove background",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "PixPerfect — fix any photo with one upload",
    description:
      "Restore, fill, remove, recolor, background remove. 20 credits free, no card.",
    siteName: "PixPerfect",
    type: "website",
    locale: "en_US",
    url: "/",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "PixPerfect — AI image editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PixPerfect — fix any photo with one upload",
    description:
      "Restore, fill, remove, recolor, background remove. 20 credits free, no card.",
    creator: "@pixperfect",
    images: ["/assets/images/logo.png"],
  },
  icons: {
    icon: [
      { url: "/assets/images/logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Edge-to-edge paint; components pad back out with env(safe-area-inset-*).
  viewportFit: "cover",
  // Shrink the layout viewport with the software keyboard on Android Chrome,
  // so 100dvh and bottom-pinned inputs react correctly.
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#14141f" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ManropeFace.variable + " font-sans antialiased"}>
        <ClerkProvider appearance={{ variables: clerkVariables }} afterSignOutUrl="/">
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
