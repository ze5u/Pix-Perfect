"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fades content up from below once it enters the viewport. The paired CSS lives
 * in globals.css and only hides the element when `html.js` is present, so a
 * page with scripts disabled still shows everything.
 */
export function Reveal<
  TagName extends React.ElementType = "div",
>(
  {
    children,
    className,
    delay = 0,
    as: Tag = "div" as TagName,
    ...rest
  }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    as?: TagName;
  } & React.ComponentPropsWithoutRef<TagName>
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion()) {
      el?.classList.add("in");
      return;
    }
    el.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  // `as` lets a section reveal itself as a <section> or <h2> without wrapping
  // it, which would break heading order and outline semantics.
  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as never}
      className={cn("reveal", className)}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Counts a figure up when it scrolls into view. Reduced motion jumps straight
 * to the end value, which is where the count would have stopped anyway.
 */
export function CountUp({
  value,
  className,
  duration = 1300,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(reduceMotion() ? value : 0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion() || started.current) return;
    started.current = true;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setShown(Math.round(eased * value));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString()}
    </span>
  );
}

/**
 * The large tagline moment. Words start muted and come to full ink one at a
 * time, in reading order, as each crosses the trigger line partway down the
 * viewport — not as a block flipping at once.
 *
 * The position check runs on a single rAF-throttled scroll frame, so the page
 * reflows once per frame rather than continuously, and stops reading positions
 * entirely once the last word has lit up.
 */
export function Tagline({
  children,
  className,
  size = "md",
}: {
  children: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const words = children.split(" ");
  const spanRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [lit, setLit] = useState(reduceMotion() ? words.length : 0);
  const frame = useRef(0);
  const containerRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (reduceMotion()) {
      setLit(words.length);
      return;
    }

    // A word lights up when it has risen above this line on the screen.
    const triggerLine = () => window.innerHeight * 0.84;

    const evaluate = () => {
      frame.current = 0;
      let next = lit;
      for (let i = 0; i < spanRefs.current.length; i++) {
        const el = spanRefs.current[i];
        if (!el) continue;
        if (next > i) continue; // never re-read a word already lit
        if (el.getBoundingClientRect().top < triggerLine()) next = i + 1;
        else break; // words are laid out in reading order, so order holds
      }
      if (next !== lit) {
        setLit(next);
        if (next === spanRefs.current.length) return "done";
      }
      return "keep";
    };

    const schedule = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        if (evaluate() === "done") window.removeEventListener("scroll", onScroll);
      });
    };

    const onScroll = () => schedule();

    // Cover the case where the section is already partly visible on load.
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.length]);

  return (
    <p
      ref={containerRef}
      className={cn(
        "text-wrap-balance font-bold tracking-tight",
        size === "lg"
          ? "text-4xl sm:text-5xl sm:leading-none"
          : "text-3xl sm:text-4xl sm:leading-none",
        className
      )}
    >
      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => {
            spanRefs.current[i] = el;
          }}
          className="transition-colors duration-500 ease-fluid"
          style={{ color: lit > i ? undefined : "rgba(7, 7, 11, 0.3)" }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
