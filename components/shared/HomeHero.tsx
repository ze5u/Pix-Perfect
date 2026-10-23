"use client";

import Link from "next/link";

import { AppIcon } from "@/components/shared/AppIcon";
import { transformLinks } from "@/constants";
import { Reveal } from "@/app/(landing)/motion";
import { cn } from "@/lib/utils";

interface HomeHeroProps {
  active: number;
}

/**
 * The dashboard hero. Mirrors the landing's "sentence as layout": one poster
 * sentence on the left, its subject (the credit balance) on the right, then
 * the five tools as a horizontal run of sentence cards below.
 *
 * `tabular-nums` on the balance keeps the digits from shifting sideways as
 * the credit count ticks down after each edit.
 */
export default function HomeHero({ active }: HomeHeroProps) {
  const isEmpty = active === 0;

  return (
    <section id="top" className="flex flex-col gap-10 md:gap-16">
      <Reveal className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl font-medium leading-none tracking-tight text-ink-950 sm:text-5xl md:text-6xl">
            Five tools, one upload.
          </h1>
          <p className="max-w-[520px] p-20-regular text-ink-500">
            Each run takes one credit and returns a file you can download
            straight away. Nothing is queued overnight, nothing bills on its own.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href={transformLinks[0].route}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-full border border-ink-950",
                isEmpty
                  ? "bg-paper px-6 text-base font-semibold text-ink-500"
                  : "bg-ink-950 px-6 text-base font-semibold text-white transition-all duration-300 ease-fluid hover:bg-ink-800 active:scale-[0.98]"
              )}
            >
              {isEmpty ? "Top up credits" : "Start editing"}
              <AppIcon name="arrow-right" size={16} />
            </Link>
            <Link
              href="#tools"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-950 bg-paper px-6 text-base font-semibold text-ink-950 transition-all duration-300 ease-fluid hover:bg-wash active:scale-[0.98]"
            >
              See the tools
            </Link>
          </div>
        </div>

        <Reveal delay={100} className="flex items-start justify-center md:justify-end">
          <div className="flex flex-col items-start gap-3 rounded-3xl border border-ink-950 bg-paper p-6 shadow-panel-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl border border-ink-950 bg-electric text-white">
                <AppIcon name="coins" size={20} />
              </span>
              <p className="text-base font-semibold text-ink-950">
                Available credits
              </p>
            </div>
            <p className="text-6xl font-bold leading-none tracking-tight text-ink-950 tabular-nums">
              {active.toLocaleString()}
            </p>
            <p className="text-sm text-ink-500">
              {active === 0
                ? "You have no credits left. Top up to keep editing."
                : active < 5
                ? "A few edits left — enough to finish what you started."
                : "Enough for the next full edit session."}
            </p>
            <Link
              href="/credits"
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-ink-950 underline-offset-4 hover:underline"
            >
              Manage credits
              <AppIcon name="arrow-right" size={14} />
            </Link>
          </div>
        </Reveal>
      </Reveal>

      <Reveal as="section" delay={200} id="tools" className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-medium tracking-tight text-ink-950 sm:text-3xl">
          Pick a fix.
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {transformLinks.map((link) => (
            <li key={link.route}>
              <Link
                href={link.route}
                className={cn(
                  "group flex h-full flex-col gap-3 rounded-2xl border border-ink-950 bg-paper p-4",
                  "transition-all duration-300 ease-fluid hover:-translate-y-1 hover:bg-wash"
                )}
              >
                <span className="flex size-9 items-center justify-center rounded-xl border border-ink-950 bg-electric text-white">
                  <AppIcon name={link.icon} size={18} />
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-base font-semibold text-ink-950">
                    {link.label}
                  </span>
                  <AppIcon
                    name="arrow-up-right"
                    size={14}
                    className="text-ink-500 transition-transform duration-300 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}