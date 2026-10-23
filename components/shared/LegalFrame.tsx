import Link from "next/link";
import type { ReactNode } from "react";

import Logo from "./Logo";

/**
 * Shared frame for the legal pages. Prose sits in one column capped at
 * max-w-3xl so a long clause never runs past a readable line length.
 *
 * This is a div rather than a <main> because the pages live under the
 * landing group, which already owns the main landmark.
 */
export default function LegalFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-1 flex-col bg-paper">
      <div className="flex justify-center border-b border-ink-200 px-4 py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Back to home">
          <Logo size={24} />
          <span className="text-sm font-semibold text-ink-500">PixPerfect</span>
        </Link>
      </div>
      <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 md:px-8 md:py-24">
        {children}
      </article>
    </div>
  );
}

export function LegalHeading({
  title,
  updated,
}: {
  title: string;
  updated: string;
}) {
  return (
    <header className="mb-10 flex flex-col gap-3 border-b border-ink-950 pb-8">
      <p className="p-12-medium font-semibold uppercase text-electric-700">
        PixPerfect
      </p>
      <h1 className="h1-display">{title}</h1>
      <p className="p-14-medium text-ink-500">Last updated {updated}</p>
    </header>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="p-16-regular text-ink-700">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 p-16-regular text-ink-700">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-electric" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
