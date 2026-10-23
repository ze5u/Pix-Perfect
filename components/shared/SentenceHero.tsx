"use client";

import type { ReactNode } from "react";

import { Reveal } from "@/app/(landing)/motion";

type SentenceHeroProps = {
  children: string;
  inline?: ReactNode;
  supporting?: string;
  actions?: ReactNode;
  subtitle?: string;
  credits?: number;
  empty?: boolean;
};

export default function SentenceHero({
  children,
  inline,
  supporting,
  actions,
  subtitle,
  empty = false,
}: SentenceHeroProps) {
  const lines = children.split("\n");
  if (lines.length === 1 && children.split(" ").length > 8) {
    const words = children.split(" ");
    const wrapAt = Math.ceil(words.length / 2);
    lines[0] = words.slice(0, wrapAt).join(" ");
    lines[1] = words.slice(wrapAt).join(" ");
  }

  return (
    <section className="flex w-full flex-col items-center gap-4 text-center md:gap-6">
      {subtitle && (
        <Reveal className="flex w-max items-center gap-2 rounded-full border border-ink-950 bg-paper px-3 py-1">
          <span className="text-xs font-medium text-ink-500">{subtitle}</span>
        </Reveal>
      )}

      <Reveal delay={100} className="flex flex-col items-center gap-4 md:gap-8">
        <span className="font-display text-4xl font-medium leading-tight tracking-tight text-ink-950 sm:text-5xl md:text-6xl lg:text-7xl">
          {lines[0]}
          {lines[1] ? <><br />{lines[1]}</> : null}
        </span>

        {inline && (
          <div className="relative mx-auto flex max-w-xs items-center justify-center md:max-w-sm lg:max-w-md">
            <div className="relative w-full rounded-2xl border border-ink-950 bg-paper p-2 shadow-panel-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink-50">
                {inline}
              </div>
              {empty && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-ink-950/10 backdrop-blur-sm">
                  <span className="px-3 py-1 text-xs font-semibold text-ink-500">No credits</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Reveal>

      {supporting && (
        <Reveal delay={200} className="mx-auto max-w-sm md:max-w-lg">
          <p className="text-base text-ink-500 md:text-lg">{supporting}</p>
        </Reveal>
      )}

      {actions && (
        <Reveal delay={300} className="mt-2 flex flex-wrap justify-center gap-3">
          {actions}
        </Reveal>
      )}
    </section>
  );
}