"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

import { AppIcon } from "@/components/shared/AppIcon";

/**
 * Sign-up view. Same frame as sign-in; the heading states the offer so a
 * visitor who lands here cold can still see the point.
 */
export default function SignUpPage() {
  return (
    <div className="flex flex-col items-stretch gap-8">
      <div className="flex flex-col gap-3 text-left">
        <h1 className="font-display text-4xl font-medium leading-none tracking-tight text-ink-950">
          20 credits, no card.
        </h1>
        <p className="text-base text-ink-500">
          Five tools, one credit each, twenty finished photos to start with.
          Nothing bills on its own.
        </p>
      </div>

      <SignUp />

      <p className="flex items-center justify-center gap-2 text-sm text-ink-500">
        Already have an account?
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1 font-semibold text-ink-950 underline-offset-4 hover:underline"
        >
          Log in
          <AppIcon name="arrow-right" size={14} />
        </Link>
      </p>
    </div>
  );
}