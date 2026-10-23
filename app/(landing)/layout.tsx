import type { ReactNode } from "react";

/**
 * The marketing shell. Pages here are unauthenticated, so there is no Clerk
 * gate, no sidebar and no top bar — the nav is rendered per page so each can
 * show the right links.
 *
 * Product pages keep their own layout, so the poster type never leaks into the
 * app. globals.css already reaches here through app/layout.tsx, so this file
 * adds no stylesheet of its own.
 */
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh w-full flex-col bg-paper">
      <Script />
      {children}
    </main>
  );
}

/**
 * Marks the document as script-enabled. Reveal and tagline styles only hide
 * content when this class is present, so a visitor without JavaScript still
 * sees every word on the page.
 */
function Script() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: "document.documentElement.classList.add('js');",
      }}
    />
  );
}
