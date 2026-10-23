import { steps } from "@/constants";
import { AppIcon } from "./AppIcon";
import { Reveal } from "@/app/(landing)/motion";

/**
 * Three steps. Deliberately short: the objection here is that AI editors are
 * fiddly, so the section should read as boring and quick rather than technical.
 */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-mist px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mb-12 max-w-[680px] md:mb-16">
          <p className="p-14-medium font-semibold uppercase text-electric-700">
            How it works
          </p>
          <h2 className="mt-2 h1-semibold">
            Upload, name the fix, download.
          </h2>
        </Reveal>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            return (
              <Reveal
                key={step.title}
                delay={i * 120}
                as="li"
                className="flex flex-col rounded-3xl border border-ink-950 bg-paper p-6 md:p-8"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-ink-950 bg-electric text-white">
                    <AppIcon name={step.icon} size={22} />
                  </span>
                  <span className="font-mono text-sm font-semibold text-ink-400">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="h3-bold">{step.title}</h3>
                <p className="mt-2 p-16-medium text-ink-500">{step.body}</p>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={200} className="mt-6 rounded-2xl border border-ink-950 bg-paper p-4 md:p-5">
          <p className="p-16-medium text-ink-700">
            The flow runs in your browser, including the compression step before
            a file is uploaded, so a large camera roll photo does not sit there
            for a minute on mobile data.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
