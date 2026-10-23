import Link from "next/link";

/**
 * Branded 404. Always leaves a way back to the page that was linked, so the
 * visitor never has to go through the footer to find one.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-paper px-4 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-ink-950 bg-electric text-white">
            <svg
              width="22"
              height="22"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M202.74,153.66a8,8,0,0,1,0,11.32L135.32,232.4a8,8,0,0,1-11.32,0L53.26,161.68a8,8,0,0,1,0-11.32l67.42-67.42a8,8,0,0,1,11.32,0Zm-67.42-49.28L72.58,156l62.74,62.74L198,156ZM160,152a8,8,0,1,1-8-8A8,8,0,0,1,160,152Z" />
            </svg>
          </span>
          <h1 className="h1-display">This page does not exist.</h1>
          <p className="max-w-[420px] p-20-regular text-ink-500">
            The link may be old, or the address has a typo in it. Your account
            and credits are untouched.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full border border-ink-950 bg-paper px-6 text-base font-semibold text-ink-950 transition-all duration-300 ease-fluid hover:bg-wash active:scale-[0.98]"
          >
            Back to home
          </Link>
          <Link
            href="/home"
            className="inline-flex h-12 items-center justify-center rounded-full border border-ink-950 bg-ink-950 px-6 text-base font-semibold text-white transition-all duration-300 ease-fluid hover:bg-ink-800 active:scale-[0.98]"
          >
            Open the editor
          </Link>
        </div>
      </div>
    </main>
  );
}
