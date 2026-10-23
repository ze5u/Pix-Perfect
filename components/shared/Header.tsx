import { cn } from "@/lib/utils";

/**
 * Section heading. Poster-scale title (matching the landing's sentence-as-layout
 * display type) with a supporting sentence below. Kept as a server component
 * — a bare `<>` fragment used to crash under React 19's stricter fragment
 * typing, so the tags here are plain.
 */
export default function Header({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h1 className="max-w-[680px] font-display text-3xl font-medium leading-none tracking-tight text-ink-950 sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="max-w-[520px] text-base text-ink-500 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}