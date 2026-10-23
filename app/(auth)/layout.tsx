import type { ReactNode } from "react";

import LandingNav from "@/components/shared/LandingNav";

/**
 * Auth pages share the landing's floating pill nav so the two feel like one
 * surface. The panel stays minimal — just a bordered card on paper — and the
 * visual weight comes from the Clerk form inside it.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh w-full flex-col bg-paper">
      <Script />
      <LandingNav />
      <div className="flex flex-1 items-center justify-center px-4 py-24 md:py-32">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}

/**
 * Marks the document as script-enabled so the Reveal/Tagline styles in
 * globals.css kick in. Without this, a page with scripts disabled would
 * show every word at once and the layout would feel different from the rest.
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