"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

import CreditsPill from "./CreditsPill";
import Logo from "./Logo";
import NavItems from "./NavItems";

/**
 * Desktop rail. This layout is protected in middleware, so the SignedOut branch
 * that used to live here can never render — the shell is only reachable
 * authenticated.
 */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-6">
        <Link
          href="/home"
          className="sidebar-logo flex items-center gap-3 rounded-2xl px-1 py-1 transition-colors duration-300 ease-fluid hover:bg-wash"
        >
          <Logo size={40} priority />
          <div className="min-w-0">
            <p className="text-base font-bold tracking-tight text-ink-950">
              PixPerfect
            </p>
            <p className="text-xs font-medium text-ink-500">AI image editor</p>
          </div>
        </Link>

        <CreditsPill />

        <NavItems className="gap-2" />

        <div className="mt-auto flex flex-col gap-3 border-t border-ink-200 pt-4">
          <UserButton afterSignOutUrl="/home" />
        </div>
      </div>
    </aside>
  );
}
