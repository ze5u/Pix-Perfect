"use client";

import { navLinks } from "@/constants";
import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Shared nav list. The desktop sidebar and the mobile sheet used to each render
 * their own copy with different active styles, so the two disagreed about what
 * was selected. One component, one rule.
 */
export default function NavItems({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  // The transformation add-routes are long; treat everything under a link's own
  // route as active so "Image Restore" stays highlighted on the form page.
  const isActive = (route: string) =>
    pathname === route ||
    (route !== "/" && pathname.startsWith(route));

  return (
    <ul className={cn("flex w-full flex-col items-start gap-2", className)}>
      {navLinks.map((link) => {
        const active = isActive(link.route);
        return (
          <li key={link.route} className="w-full">
            <Link
              href={link.route}
              aria-current={active ? "page" : undefined}
              className={cn(
                "sidebar-nav_element group w-full",
                active
                  ? "border-ink-950 bg-electric text-white"
                  : "border-transparent"
              )}
            >
              <span
                aria-hidden
                className={cn("flex size-8 shrink-0 items-center justify-center", active && "bg-white/15")}
              >
                <AppIcon name={link.icon} />
              </span>
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
