import Link from "next/link";

import { AppIcon } from "@/components/shared/AppIcon";
import { primaryCta } from "@/constants";
import { Reveal } from "@/app/(landing)/motion";

/**
 * The closing call. It repeats the hero's promise rather than introducing a new
 * one, and leans on the risk reversal: nothing to put on file, nothing to cancel.
 */
export default function FinalCta() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="flex flex-col items-start gap-8 rounded-3xl border border-ink-950 bg-electric p-8 text-white md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-[680px]">
            <h2 className="font-bold tracking-tight text-4xl text-white md:text-5xl">
              Your first edit is free.
            </h2>
            <p className="mt-3 p-20-regular text-white/80">
              Twenty credits, one per edit, any tool. If the first one is not
              worth a top up, that is still nothing spent.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              <li className="flex items-center gap-2 p-14-medium font-medium">
                <AppIcon name="coins" size={16} className="text-sun" />
                20 credits, no card
              </li>
              <li className="flex items-center gap-2 p-14-medium font-medium">
                <AppIcon name="shield-check" size={16} className="text-mint" />
                Nothing to cancel
              </li>
            </ul>
          </div>

          <Link
            href={primaryCta.href}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full border border-ink-950 bg-white px-6 text-base font-semibold text-ink-950 transition-all duration-300 ease-fluid hover:bg-sun active:scale-[0.98] md:h-14"
          >
            {primaryCta.label}
            <AppIcon name="arrow-right" size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
