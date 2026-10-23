"use client";

import { toast } from "sonner";
import Link from "next/link";

import { AppIcon } from "@/components/shared/AppIcon";
import { plans } from "@/constants";
import { Reveal } from "@/app/(landing)/motion";

/**
 * Plans. There is no checkout yet, so the buttons say so instead of silently
 * looking dead. The honest thing is more useful here than a fake loading state.
 */
export default function PlansSection() {
  return (
    <section id="plans" className="scroll-mt-24 bg-ink-950 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mb-12 max-w-[680px] md:mb-16">
          <p className="p-14-medium font-semibold uppercase text-electric-300">
            Credits
          </p>
          <h2 className="mt-2 h1-semibold text-white">
            Start with twenty, top up when you run out.
          </h2>
          <p className="mt-3 p-20-regular text-white/60">
            Credits are spent as you go. Nothing bills on its own and there is
            nothing to cancel.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {plans.map((plan, i) => (
            <Reveal
              key={plan._id}
              delay={i * 100}
              as="article"
              className={`flex flex-col rounded-3xl border p-6 md:p-8 ${
                plan.price === 0
                  ? "border-ink-950 bg-paper text-ink-950"
                  : "border-white/20 bg-transparent text-white"
              }`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <h3 className="h3-bold">{plan.name}</h3>
                {i === 1 && (
                  <span className="rounded-full border border-ink-950 bg-sun p-12-medium font-semibold text-ink-950">
                    Most used
                  </span>
                )}
              </div>

              <p className="flex items-baseline gap-2">
                <span className="font-bold tracking-tight text-4xl">
                  {plan.price === 0 ? "$0" : `$${plan.price}`}
                </span>
                <span
                  className={`p-14-medium ${plan.price === 0 ? "text-ink-500" : "text-white/60"}`}
                >
                  per top up
                </span>
              </p>
              <p className="p-14-medium font-semibold text-electric-700">
                {plan.credits.toLocaleString()} credits
              </p>

              <ul className="my-6 flex flex-col gap-2">
                {plan.inclusions.map((inc) => (
                  <li
                    key={inc.label}
                    className={`flex items-center gap-2 p-14-medium ${
                      inc.isIncluded ? "" : "text-ink-400 line-through"
                    }`}
                  >
                    {inc.isIncluded ? (
                      <AppIcon name="check" size={16} className="shrink-0 text-mint" />
                    ) : (
                      <AppIcon name="x" size={16} className="shrink-0 opacity-50" />
                    )}
                    {inc.label}
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <Link
                  href="/sign-up"
                  className="mt-auto inline-flex h-12 items-center justify-center rounded-full border border-ink-950 bg-ink-950 text-base font-semibold text-white transition-all duration-300 ease-fluid hover:bg-ink-800 active:scale-[0.98]"
                >
                  Start with 20 free
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Checkout is not live yet", {
                      description:
                        "Bundles are not open for purchase. Start free and top up when you ask us to.",
                    })
                  }
                  className="mt-auto inline-flex h-12 items-center justify-center rounded-full border border-white bg-white text-base font-semibold text-ink-950 transition-all duration-300 ease-fluid hover:bg-mint active:scale-[0.98]"
                >
                  Request this bundle
                </button>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
