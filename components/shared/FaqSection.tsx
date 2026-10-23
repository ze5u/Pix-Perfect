"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";

import { faq } from "@/constants";
import { cn } from "@/lib/utils";
import { Reveal } from "@/app/(landing)/motion";

/**
 * FAQ. Sits above the final CTA because the objections here are about cost and
 * file handling, which is what stops someone clicking. The first question opens
 * so a skimming reader meets an answer immediately.
 */
export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16">
        <Reveal className="max-w-[420px]">
          <p className="p-14-medium font-semibold uppercase text-electric-700">
            Questions
          </p>
          <h2 className="mt-2 h1-semibold">
            The parts people ask about first.
          </h2>
          <p className="mt-3 p-20-regular text-ink-500">
            If yours is not here, ask and you will get an answer from a person who
            uses the tool.
          </p>
        </Reveal>

        <div>
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal
                key={item.q}
                delay={Math.min(i, 5) * 60}
                as="div"
                className="border-b border-ink-200 first:border-t"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors duration-300 ease-fluid hover:text-electric-700"
                  >
                    <span className="p-16-semibold text-ink-950">{item.q}</span>
                    <CaretDown
                      size={18}
                      weight="bold"
                      className={cn(
                        "shrink-0 text-ink-500 transition-transform duration-300 ease-fluid",
                        isOpen && "rotate-180 text-electric"
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className={cn(
                    "grid overflow-hidden transition-all duration-300 ease-fluid",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0">
                    <p className="pb-5 pr-8 p-16-medium text-ink-500">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
