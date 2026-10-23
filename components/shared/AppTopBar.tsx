"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navLinks } from "@/constants";
import { cn } from "@/lib/utils";
import CreditsPill from "./CreditsPill";
import Logo from "./Logo";
import { AppIcon } from "./AppIcon";

/**
 * The authenticated shell's top bar. Same floating-pill chrome as the landing
 * nav so the two surfaces read as one site, but the middle holds the app
 * routes (Home, Credits, the five tools) rather than the landing anchors.
 *
 * Anchors to the marketing page and the credits page are also reachable from
 * the wordmark and from CreditsPill respectively, so no separate links here.
 */
export default function AppTopBar() {
  const pathname = usePathname();
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
    // Any route change closes the mobile menu — Clerk's useCloseOnNavigate
    // hook is not available in this build.
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (route: string) =>
    pathname === route ||
    (route !== "/" && route !== "/home" && pathname.startsWith(route));

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
          {navLinks.map((link) => {
            const active = isActive(link.route);
            return (
              <li key={link.route}>
                <Link
                  href={link.route}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors duration-300 ease-fluid",
                    active
                      ? "bg-ink-950 font-semibold text-white"
                      : "font-medium text-ink-500 hover:bg-wash hover:text-ink-950"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-1 md:flex">
          <CreditsPill className="h-9" />
          <UserButton afterSignOutUrl="/" />
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
            <div className="flex items-center justify-between pb-6">
              <div className="flex items-center gap-2">
                <Logo size={32} />
                <span className="text-base font-bold tracking-tight text-white">
                  PixPerfect
                </span>
              </div>
              <CreditsPill className="h-9" />
            </div>

            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const active = isActive(link.route);
                return (
                  <li
                    key={link.route}
                    className="opacity-0"
                    style={{ ...menuIn, animationDelay: `${i * 100}ms` }}
                  >
                    <Link
                      href={link.route}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-2 py-3 text-3xl font-bold tracking-tight",
                        active ? "text-electric-200" : "text-white"
                      )}
                    >
                      <AppIcon name={link.icon} size={24} className="shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              className="mt-8 flex flex-col gap-3 opacity-0"
              style={{ ...menuIn, animationDelay: "600ms" }}
            >
              <UserButton afterSignOutUrl="/" />
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