"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Toast host. Kept deliberately free of next-themes: this app is light-only, so
 * reading an optional theme here just made every toast depend on a provider
 * that isn't mounted.
 */
const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => (
  <Sonner
    theme="light"
    richColors
    closeButton
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:border-ink-950 group-[.toaster]:bg-paper group-[.toaster]:text-ink-950 rounded-2xl",
        description: "group-[.toast]:text-ink-500",
        actionButton: "group-[.toast]:bg-electric group-[.toast]:text-white",
        cancelButton: "group-[.toast]:bg-wash group-[.toast]:text-ink-500",
      },
    }}
    {...props}
  />
);

export { Toaster };
