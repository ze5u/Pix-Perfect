import { CountUp, Reveal } from "@/app/(landing)/motion";

import { stats, testimonials } from "@/constants";

/**
 * Proof sits next to the claims it supports: a small band of the numbers a
 * visitor can actually check, then testimonials written as a situation rather
 * than as praise.
 */
export default function ProofSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mb-12 max-w-[680px] md:mb-16">
          <p className="p-14-medium font-semibold uppercase text-electric-700">
            The fine print
          </p>
          <h2 className="mt-2 h1-semibold">
            Three numbers you can check instead of trust.
          </h2>
        </Reveal>

        <dl className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 100}
              as="div"
              className="flex flex-col gap-2 rounded-3xl border border-ink-950 bg-paper p-6 md:p-8"
            >
              <dt className="order-2 p-16-medium text-ink-500">{stat.label}</dt>
              <dd className="order-1 flex items-baseline gap-2">
                <CountUp
                  value={stat.value}
                  className="h1-display font-bold tracking-tight"
                />
                {stat.suffix && (
                  <span className="p-18-semibold text-ink-700">{stat.suffix}</span>
                )}
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={Math.min(i, 2) * 120}
              as="figure"
              className="flex flex-col gap-5 rounded-3xl border border-ink-950 bg-wash p-6 md:p-8"
            >
              <blockquote className="p-16-medium text-ink-800">{t.quote}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-full border border-ink-950 p-12-medium font-semibold text-white"
                  style={{ backgroundColor: t.accent }}
                >
                  {t.initials}
                </span>
                <span className="flex flex-col">
                  <span className="p-14-medium font-semibold text-ink-950">{t.name}</span>
                  <span className="p-12-medium text-ink-500">{t.role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-6">
          <p className="p-12-medium text-ink-400">
            Testimonials describe individual results. Very old or heavily damaged
            photos do not always come back cleanly, and the preview shows that
            before a credit is spent.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
