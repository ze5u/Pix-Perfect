import Link from "next/link";

import { primaryCta, tools } from "@/constants";
import { AppIcon } from "./AppIcon";
import { Reveal } from "@/app/(landing)/motion";

/**
 * The hero. One offer, one action: 20 credits free, no card, first edit away.
 * The visual is the product surface itself, drawn from the design system, so
 * there is no stock photo standing in for something that does not exist.
 */
export default function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pt-32 md:px-8 md:pt-40">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-6">
          <Reveal as="span" className="flex w-max items-center gap-2 rounded-full border border-ink-950 bg-paper p-1 pl-2">
            <AppIcon name="coins" size={16} className="text-electric" />
            <span className="text-sm font-semibold text-ink-950">20 credits free</span>
            <span aria-hidden className="mx-1 h-3 w-px bg-ink-200" />
            <span className="text-sm font-medium text-ink-500">no card</span>
          </Reveal>

          <Reveal delay={100} as="h1" className="max-w-[680px] font-bold tracking-tight text-5xl md:text-7xl">
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #000000, #666666)" }}
            >
              Fix any photo
              <br />
              with one upload.
            </span>
          </Reveal>

          <Reveal delay={200} as="p" className="max-w-[680px] p-20-regular text-ink-500">
            Restore a scratched scan, fill the edges out, remove a passerby,
            recolor an object, cut out the background. Five tools, one credit
            each, twenty to start.
          </Reveal>

          <Reveal delay={300} as="div" className="flex flex-wrap items-center gap-3">
            <Link
              href={primaryCta.href}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-950 bg-ink-950 px-6 text-base font-semibold text-white transition-all duration-300 ease-fluid hover:bg-ink-800 active:scale-[0.98]"
            >
              {primaryCta.label}
              <AppIcon name="arrow-right" size={18} />
            </Link>
            <a
              href="#tools"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-950 bg-paper px-6 text-base font-semibold text-ink-950 transition-all duration-300 ease-fluid hover:bg-wash active:scale-[0.98]"
            >
              See the five tools
            </a>
          </Reveal>

          <Reveal delay={400} as="p" className="flex flex-wrap items-center gap-x-2 gap-y-1 p-14-medium text-ink-500">
            <AppIcon name="check-circle" size={16} className="text-mint" />
            No signup wall before your first edit
            <span aria-hidden>·</span>
            <AppIcon name="check-circle" size={16} className="text-mint" />
            Cancel nothing, nothing bills on its own
          </Reveal>
        </div>

        <Reveal delay={200} className="flex justify-center md:justify-end">
          <EditorMock />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * A faithful mock of the editor: the five tools, an image well, and the
 * credit that the edit spends. Built from flat panels and hairlines so it
 * matches the real product instead of pretending to be a screenshot.
 */
function EditorMock() {
  return (
    <figure
      aria-label="PixPerfect editor showing five tools and a restored photo"
      className="w-full max-w-md rounded-3xl border border-ink-950 bg-paper p-4 shadow-panel-lg"
    >
      <figcaption className="sr-only">
        The editor lists five tools and spends one credit per edit.
      </figcaption>

      <div className="flex items-center justify-between px-1 pb-4">
        <p className="text-sm font-semibold text-ink-950">Untitled restore</p>
        <span className="flex h-8 items-center gap-1.5 rounded-full border border-ink-950 bg-wash px-3 text-xs font-semibold text-ink-950">
          <AppIcon name="coins" size={14} className="text-electric" />
          19 left
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {tools.map((tool, i) => {
          const active = i === 0;
          return (
            <div
              key={tool.key}
              title={tool.action}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2 ${
                active
                  ? "border-ink-950 bg-electric text-white"
                  : "border-ink-950 bg-paper text-ink-950"
              }`}
            >
              <AppIcon name={tool.icon} />
              <span className="text-xs font-medium leading-none">{tool.action}</span>
            </div>
          );
        })}
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-2">
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-300 bg-mist">
          <span className="p-12-medium text-ink-400">before</span>
          <ScratchArt tone="muted" />
        </div>
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-ink-950 bg-wash">
          <span className="p-12-medium text-electric-700">after</span>
          <ScratchArt tone="clean" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-ink-950 bg-ink-950 p-3">
        <p className="p-14-medium text-white">Restore applied</p>
        <span className="inline-flex h-9 items-center rounded-full bg-white px-3 text-sm font-semibold text-ink-950">
          1 credit
        </span>
      </div>
    </figure>
  );
}

/**
 * A small abstract "photo" the before and after panels both use, so the
 * comparison reads without shipping a real photograph.
 */
function ScratchArt({ tone }: { tone: "muted" | "clean" }) {
  const dim = tone === "muted";
  return (
    <div className="relative size-16 overflow-hidden rounded-xl border border-ink-950">
      <div className={`absolute inset-0 ${dim ? "bg-ink-200" : "bg-lilac"}`}>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-grape/70" />
        <div className="absolute left-2 top-2 size-5 rounded-full bg-sun" />
        <div className="absolute bottom-2 right-2 h-6 w-10 rounded-t-lg bg-mint/80" />
        {dim && (
          <>
            <span className="absolute left-1 top-6 h-px w-10 -rotate-12 bg-ink-500/70" />
            <span className="absolute bottom-5 right-1 h-px w-8 rotate-45 bg-ink-500/70" />
            <span className="absolute left-1/2 top-0 h-full w-px bg-ink-400/60" />
          </>
        )}
      </div>
    </div>
  );
}
