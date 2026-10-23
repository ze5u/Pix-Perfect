"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { primaryCta } from "@/constants";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const links = [
  { label: "Tools", href: "#tools" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Plans", href: "#plans" },
  { label: "FAQ", href: "#faq" },
] as const;

/**
 * Floating island nav. The pill sits detached from the top edge; on mobile the
 * hamburger's three bars rotate into an X and the menu opens as a full-screen
 * glass panel with links staggered in.
 */
export default function LandingNav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the overlay is up. Reset on unmount too, so an open
  // menu never leaves the page stuck.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-6">
      <nav
        aria-label="Main"
        className="mx-auto flex w-max max-w-full items-center gap-1 rounded-full border border-ink-950 bg-paper/90 p-1.5 shadow-panel backdrop-blur-xl"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors duration-300 ease-fluid hover:bg-wash"
        >
          <Logo size={28} />
          <span className="hidden text-sm font-semibold text-ink-950 sm:block">
            PixPerfect
          </span>
        </Link>

        <ul className="hidden items-center md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-500 transition-colors duration-300 ease-fluid hover:bg-wash hover:text-ink-950"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/sign-in"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-950 transition-colors duration-300 ease-fluid hover:bg-wash"
          >
            Sign in
          </Link>
          <Link
            href={primaryCta.href}
            className="rounded-full border border-ink-950 bg-ink-950 px-3 py-1.5 text-sm font-semibold text-white transition-all duration-300 ease-fluid hover:bg-ink-800 active:scale-[0.98]"
          >
            {primaryCta.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative flex size-9 items-center justify-center rounded-full border border-ink-950 bg-paper md:hidden"
        >
          <span className="relative block size-5">
            <span
              className={cn(
                "absolute left-1/2 top-0 block h-0.5 w-4 -translate-x-1/2 rounded-full bg-ink-950 transition-all duration-300 ease-fluid",
                open && "top-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-1/2 top-2 block h-0.5 w-4 -translate-x-1/2 rounded-full bg-ink-950 transition-all duration-300 ease-fluid",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute left-1/2 top-4 block h-0.5 w-4 -translate-x-1/2 rounded-full bg-ink-950 transition-all duration-300 ease-fluid",
                open && "top-2 -rotate-45"
              )}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col bg-ink-950/80 backdrop-blur-3xl md:hidden"
        >
          <div className="flex-1 px-4 pt-24">
            <ul className="flex flex-col gap-1">
              {links.map((link, i) => (
                <li
                  key={link.href}
                  className="opacity-0"
                  style={{ ...menuIn, animationDelay: `${i * 100}ms` }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-2 py-3 text-3xl font-bold tracking-tight text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div
              className="mt-8 flex flex-col gap-3 opacity-0"
              style={{ ...menuIn, animationDelay: "400ms" }}
            >
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-4 text-base font-semibold text-white"
              >
                Sign in
              </Link>
              <Link
                href={primaryCta.href}
                onClick={() => setOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-4 text-base font-semibold text-ink-950"
              >
                {primaryCta.label}
              </Link>
            </div>
          </div>

          <p className="px-4 pb-8 text-xs font-medium text-white/50">
            20 credits free. No card required.
          </p>
        </div>
      )}

      {/* The one curve used across the site, plus the staggered menu rise. */}
      <style jsx global>{`
        @keyframes menu-in {
          from {
            opacity: 0;
            transform: translateY(3rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes menu-in {
            from { opacity: 0; transform: none; }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </header>
  );
}

// The staggered rise each menu item plays on open. Shared so the shorthand and
// the delay never drift out of sync.
const menuIn: React.CSSProperties = {
  animation: "menu-in 500ms cubic-bezier(0.32, 0.72, 0, 1) both",
};
