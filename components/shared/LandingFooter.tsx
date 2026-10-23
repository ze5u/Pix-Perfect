import Link from "next/link";

import Logo from "./Logo";
import { AppIcon } from "./AppIcon";

const product = [
  { label: "Image restore", href: "/transformations/add/restore" },
  { label: "Generative fill", href: "/transformations/add/fill" },
  { label: "Object remove", href: "/transformations/add/remove" },
  { label: "Object recolor", href: "/transformations/add/recolor" },
  { label: "Background remove", href: "/transformations/add/removeBackground" },
] as const;

const account = [
  { label: "Sign in", href: "/sign-in" },
  { label: "Create account", href: "/sign-up" },
  { label: "Open the editor", href: "/home" },
] as const;

/**
 * Footer for the marketing shell only. Product pages use their own chrome, so
 * these links never show inside the app where they would be confusing.
 */
export default function LandingFooter() {
  return (
    <footer className="border-t border-ink-950 bg-paper px-4 py-16 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-base font-semibold text-ink-950">PixPerfect</span>
            </Link>
            <p className="mt-4 max-w-[280px] p-14-medium text-ink-500">
              Five image edits, one credit each. Upload a photo and fix the one
              thing that is wrong with it.
            </p>
          </div>

          <nav aria-label="Tools">
            <p className="p-12-medium font-semibold uppercase text-ink-400">Tools</p>
            <ul className="mt-4 flex flex-col gap-2">
              {product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="p-14-medium text-ink-700 transition-colors duration-300 ease-fluid hover:text-electric-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account">
            <p className="p-12-medium font-semibold uppercase text-ink-400">Account</p>
            <ul className="mt-4 flex flex-col gap-2">
              {account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="p-14-medium text-ink-700 transition-colors duration-300 ease-fluid hover:text-electric-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <p className="p-12-medium font-semibold uppercase text-ink-400">Legal</p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <Link href="/privacy" className="p-14-medium text-ink-700 transition-colors duration-300 ease-fluid hover:text-electric-700">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="p-14-medium text-ink-700 transition-colors duration-300 ease-fluid hover:text-electric-700">
                  Terms of service
                </Link>
              </li>
              <li>
                <a href="mailto:support@pixperfect.app" className="p-14-medium text-ink-700 transition-colors duration-300 ease-fluid hover:text-electric-700">
                  support@pixperfect.app
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-200 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="p-12-medium text-ink-500">
            &copy; {new Date().getFullYear()} PixPerfect. Credits do not expire once issued.
          </p>
          <p className="flex items-center gap-2 p-12-medium text-ink-500">
            <AppIcon name="globe-simple" size={14} />
            Runs in your browser, hosted uploads only
          </p>
        </div>
      </div>
    </footer>
  );
}
