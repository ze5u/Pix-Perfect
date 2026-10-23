"use client";

import { useAuth } from "@clerk/nextjs";
import { Coins } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getUserById } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";

/**
 * Shows the remaining credit balance and links to /credits. Reads its own value
 * rather than being passed one, so both navs stay in sync after a transform.
 */
export default function CreditsPill({ className = "" }: { className?: string }) {
  const { userId, isLoaded } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    getUserById(userId)
      .then((user) => active && setCredits(user?.creditBalance ?? 0))
      .catch(() => active && setCredits(null));
    return () => {
      active = false;
    };
  }, [userId]);

  if (!isLoaded || !userId) return null;

  const empty = credits === 0;

  return (
    <Link
      href="/credits"
      aria-label="Credit balance"
      className={cn(
        "sticker-pill transition-transform duration-300 ease-fluid active:scale-[0.97]",
        empty && "border-ember bg-ember/15",
        className
      )}
    >
      <Coins size={16} weight="bold" className={cn("text-electric", empty && "opacity-60")} />
      {credits === null ? (
        <span className="block h-4 w-14 rounded-pill bg-wash-strong" />
      ) : (
        <span className="font-semibold">
          {credits.toLocaleString()}
          <span className="text-ink-500"> credits</span>
        </span>
      )}
    </Link>
  );
}
