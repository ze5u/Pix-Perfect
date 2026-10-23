"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { AppIcon } from "@/components/shared/AppIcon";

/**
 * Sign-in view. Clerk's built-in SignIn is kept — the Clerk team ships and
 * patches that form, and rebuilding it by hand would silently lose email-
 * verification and password-reset flows. What changes here is the frame:
 * the paper card, the sentence above, the ghost link to the other view.
 */
export default function SignInPage() {
  return (
    <div className="flex flex-col items-stretch gap-8">
      <div className="flex flex-col gap-3 text-left">
        <h1 className="font-display text-4xl font-medium leading-none tracking-tight text-ink-950">
          Log back in.
        </h1>
        <p className="text-base text-ink-500">
          Your 20 free credits and your library are waiting on the other side.
        </p>
      </div>

      <SignIn />

      <p className="flex items-center justify-center gap-2 text-sm text-ink-500">
        New here?
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-1 font-semibold text-ink-950 underline-offset-4 hover:underline"
        >
          Make an account
          <AppIcon name="arrow-right" size={14} />
        </Link>
      </p>
    </div>
  );
}