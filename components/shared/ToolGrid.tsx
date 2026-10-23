import Link from "next/link";

import { tools } from "@/constants";
import { AppIcon } from "./AppIcon";
import { Reveal } from "@/app/(landing)/motion";

/**
 * The five tools. Each one is written as a before and after rather than as a
 * feature list, because the visitor already knows what they want done and does
 * not care what the model calls it.
 */
export default function ToolGrid() {
  return (
    <section id="tools" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mb-12 max-w-[680px] md:mb-16">
          <p className="p-14-medium font-semibold uppercase text-electric-700">
            Five tools
          </p>
          <h2 className="mt-2 h1-semibold">
            One upload, then pick the fix you need.
          </h2>
          <p className="mt-3 p-20-regular text-ink-500">
            Every tool costs one credit, and the credit is spent only when you
            run the edit, not when you upload.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {tools.map((tool, i) => {
            return (
              <Reveal
                key={tool.key}
                delay={Math.min(i, 3) * 100}
                as="article"
                className="group flex flex-col rounded-3xl border border-ink-950 bg-paper p-6 transition-all duration-300 ease-fluid hover:-translate-y-1 hover:bg-wash md:p-8"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border border-ink-950 ${tool.accent}`}
                  >
                    <AppIcon name={tool.icon} size={22} className="text-ink-950" />
                  </span>
                  <span aria-hidden className="p-14-medium font-semibold text-ink-300 transition-colors duration-300 ease-fluid group-hover:text-electric">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="h3-bold">
                  From {tool.before} to {tool.after}.
                </h3>
                <p className="mt-2 p-16-medium text-ink-500">{tool.detail}</p>

                <Link
                  href={tool.route}
                  className="mt-6 inline-flex w-max items-center gap-1.5 p-16-semibold text-electric-700"
                >
                  Open {tool.action.toLowerCase()}
                  <AppIcon
                    name="arrow-up-right"
                    size={16}
                    className="transition-transform duration-300 ease-fluid group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </Reveal>
            );
          })}

          {/* Fifth slot closes the grid as a risk reversal, not as another tool. */}
          <Reveal
            delay={300}
            as="article"
            className="flex flex-col justify-between rounded-3xl border border-ink-950 bg-ink-950 p-6 text-white md:p-8"
          >
            <h3 className="h3-bold text-white">
              Not sure which one to start with?
            </h3>
            <p className="mt-3 p-16-medium text-white/70">
              Restore is the one most first edits use. It also gives the clearest
              before and after, so you can judge the quality before you spend
              anything more.
            </p>
            <Link
              href="/transformations/add/restore"
              className="mt-6 inline-flex h-12 w-max items-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-ink-950 transition-all duration-300 ease-fluid hover:bg-mint active:scale-[0.98]"
            >
              Start with restore
              <AppIcon name="arrow-up-right" size={18} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
