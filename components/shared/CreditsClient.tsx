"use client";

import Link from "next/link";
import { toast } from "sonner";

import { AppIcon } from "@/components/shared/AppIcon";
import { Reveal } from "@/app/(landing)/motion";
import { plans } from "@/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Credits page. Rebuilt with the landing's "sentence as layout" grammar:
 * one poster balance on the left, the plan ladder as a list of sentences
 * on the right, so reading the prices is reading sentences rather than
 * scanning cards. No "POPULAR" / "FREE" chips — the copy carries the pitch.
 */
export default function CreditsClient({ balance }: { balance: number }) {
  return (
    <div className="flex flex-col gap-16 animate-fade-in md:gap-24">
      <Reveal className="grid gap-10 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl font-medium leading-none tracking-tight text-ink-950 sm:text-5xl md:text-6xl">
            Your credits.
          </h1>
          <p className="max-w-[420px] p-20-regular text-ink-500">
            One credit is one finished photo, on any of the five tools. Your
            balance only moves when you run an edit.
          </p>
        </div>

        <Reveal delay={100} className="flex items-end justify-center md:justify-end">
          <div className="flex w-full flex-col items-start gap-3 rounded-3xl border border-ink-950 bg-paper p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl border border-ink-950 bg-electric text-white">
                <AppIcon name="coins" size={20} />
              </span>
              <p className="text-base font-semibold text-ink-950">
                Available credits
              </p>
            </div>
            <p className="text-6xl font-bold leading-none tracking-tight text-ink-950 tabular-nums sm:text-7xl">
              {balance.toLocaleString()}
            </p>
            <p className="text-sm text-ink-500">
              {balance === 0
                ? "You have no credits left. Pick a plan below to keep editing."
                : balance < 5
                ? "A few edits left — enough to finish what you started."
                : `Enough for ${balance} finished photos.`}
            </p>
            <Link
              href="/transformations/add/restore"
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-ink-950 underline-offset-4 hover:underline"
            >
              Spend one on a restore
              <AppIcon name="arrow-right" size={14} />
            </Link>
          </div>
        </Reveal>
      </Reveal>

      <Reveal as="section" id="plans" delay={200} className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-medium tracking-tight text-ink-950 sm:text-3xl">
          Top up when you want to.
        </h2>

        <ul className="flex flex-col gap-4">
          {plans.map((plan, i) => (
            <li
              key={plan._id}
              className="grid gap-4 rounded-3xl border border-ink-950 bg-paper p-6 md:grid-cols-[1fr_auto] md:gap-8 md:p-8"
            >
              <div className="flex flex-col gap-3">
                <p className="font-display text-3xl font-medium leading-none tracking-tight text-ink-950 sm:text-4xl">
                  {plan.credits.toLocaleString()} credits{" "}
                  <span className="text-ink-500">
                    for ${plan.price}
                  </span>
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {plan.inclusions.map((inc) => (
                    <li
                      key={inc.label}
                      className={cn(
                        "flex items-center gap-1.5 text-sm",
                        inc.isIncluded ? "text-ink-950" : "text-ink-400 line-through"
                      )}
                    >
                      {inc.isIncluded && (
                        <AppIcon
                          name="check"
                          size={14}
                          className="text-mint"
                        />
                      )}
                      {inc.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start justify-center gap-2 md:items-end">
                <p className="text-xs font-medium text-ink-500">
                  {plan.price === 0
                    ? "Starts your account"
                    : "Charged once, never renews"}
                </p>
                <Button
                  className={
                    i === 0 ? "ghost-button w-full md:w-auto" : "submit-button w-full md:w-auto"
                  }
                  onClick={() =>
                    toast.info("Checkout is not wired up yet", {
                      description: "Hook this plan card to your payment provider.",
                    })
                  }
                >
                  {plan.price === 0 ? "Start free" : `Get ${plan.credits.toLocaleString()} credits`}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}