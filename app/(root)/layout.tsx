import AppTopBar from "@/components/shared/AppTopBar";
import { Toaster } from "@/components/ui/sonner";

import type { ReactNode } from "react";

/**
 * The authenticated shell. Replaces the old sidebar + top-bar layout with a
 * single floating pill nav (matching the landing page) and a paper ground.
 * Middleware already guards every route under (root), so nothing here has to
 * check for a session.
 *
 * `pt-24` clears the fixed pill nav; the old `.root` flex layout is gone
 * because there is no sidebar column to sit beside.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh w-full flex-col bg-paper pt-24">
      <AppTopBar />
      <div className="flex-1">
        <div className="wrapper py-8 md:py-12">{children}</div>
      </div>
      <Toaster richColors position="top-center" closeButton />
    </main>
  );
}