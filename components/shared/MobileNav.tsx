"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import CreditsPill from "./CreditsPill";
import Logo from "./Logo";
import NavItems from "./NavItems";

/**
 * Mobile bar. Safe-area top padding comes from the .header class so content
 * clears the notch. The sheet is state-driven so tapping a link closes it —
 * this Clerk build has no useCloseOnNavigate hook.
 */
export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="header">
      <Link href="/home" className="flex items-center gap-2" aria-label="PixPerfect home">
        <Logo size={32} priority />
      </Link>

      <nav className="flex items-center gap-2">
        <CreditsPill />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex size-11 items-center justify-center rounded-full border border-ink-950 bg-paper transition-all duration-300 ease-fluid active:scale-[0.98]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block size-5" aria-hidden>
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
          </SheetTrigger>
          <SheetContent
            className="sheet-content w-full rounded-t-3xl border-ink-950 bg-paper pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:w-72 sm:rounded-t-0"
            side="right"
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo size={32} />
                  <span className="text-base font-bold tracking-tight text-ink-950">
                    PixPerfect
                  </span>
                </div>
                <UserButton afterSignOutUrl="/home" />
              </div>
              <NavItems className="gap-2" />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
