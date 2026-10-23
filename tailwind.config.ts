import type { Config } from 'tailwindcss';

/**
 * PixPerfect — "sticker on paper".
 *
 * Language: a paper-white canvas, 1px near-black hairlines on everything that
 * can be touched, pill-shaped controls, flat fills, one dominant brand colour
 * plus a small set of flat sticker accents. Elevation is colour bands and
 * hairlines, not drop shadows.
 *
 * Nothing here invents its own scales. `borderRadius`, `spacing` and `fontSize`
 * are deliberately NOT overridden, so Tailwind's own defaults are the only
 * values in play — a `rounded-2xl` is always 16px and a `gap-4` is always
 * 16px, with nothing to land between two steps.
 */
const config: Config = {
  darkMode: ['class'],

  // Gate `hover:` behind a real hover capability so touch devices never keep a
  // stuck :hover state after a tap.
  future: {
    hoverOnlyWhenSupported: true,
  },

  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
  ],

  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1440px' },
    },

    extend: {
      colors: {
        // ---- Surfaces -------------------------------------------------------
        paper: '#ffffff',
        mist: '#fbfaff',
        wash: '#f4efff',
        'wash-strong': '#e9dfff',

        // ---- Ink (text + hairlines) ----------------------------------------
        ink: {
          950: '#07070b',
          900: '#14141f',
          800: '#22222f',
          700: '#3f3f52',
          600: '#52526a',
          500: '#6b6b80',
          400: '#8d8da0',
          300: '#b8b8c7',
          200: '#e4e4ec',
          100: '#f2f2f7',
        },

        // ---- Brand: electric purple ----------------------------------------
        electric: {
          50: '#f5f0ff',
          100: '#ece3ff',
          200: '#d8c5ff',
          300: '#b997ff',
          400: '#9a5eff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b1668',
          950: '#27104a',
          DEFAULT: '#7c3aed',
        },

        // ---- Sticker accents (flat fills only) -----------------------------
        mint: '#1ed18b',
        ember: '#ff4d1c',
        sun: '#ffc233',
        grape: '#5c4ade',
        lilac: '#e9ccff',

        // ---- Semantic ------------------------------------------------------
        success: '#1ed18b',
        warning: '#ffc233',
        info: '#4c9dff',
        // `destructive` is wired through the shadcn tokens below so that
        // `text-destructive` and `text-destructive-foreground` stay in sync.

        // ---- shadcn/ui token wiring ----------------------------------------
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // ---- Legacy names, remapped to the current palette ----------------
        // Older markup still says `purple-*` and `dark-*`. Keeping the keys
        // pointed at the new values means the redesign needs no class churn.
        purple: {
          50: '#f5f0ff',
          100: '#ece3ff',
          200: '#d8c5ff',
          300: '#b997ff',
          400: '#9a5eff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b1668',
        },
        dark: {
          100: '#f2f2f7',
          200: '#e4e4ec',
          300: '#b8b8c7',
          400: '#8d8da0',
          500: '#6b6b80',
          600: '#2b2b3d',
          700: '#14141f',
          800: '#22222f',
          900: '#07070b',
        },
      },

      fontFamily: {
        // One face for the whole site. `display` is kept as an alias of `sans`
        // so the many existing `font-display` usages keep rendering, now in the
        // same face rather than in a font that was never loaded.
        display: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      // Every transition on the site runs this one curve — it simulates real
      // mass rather than a linear fade, and is the only easing that appears.
      transitionTimingFunction: {
        fluid: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },

      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },

        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },

        // Panels and toasts travel a short distance. Nothing moves more than
        // 16px — a bigger travel reads as a page transition, not a panel.
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },

        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },

        // Skeleton loaders are flat fills with a slow breath. The old shimmer
        // painted a linear gradient into the background, which the visual rules
        // disallow, so movement comes from opacity only.
        'breathe': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },

        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },

        // Decorative only. Gated by prefers-reduced-motion in globals.css.
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--sticker-rotate, 0deg))' },
          '50%': { transform: 'translateY(-8px) rotate(var(--sticker-rotate, 0deg))' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
        'accordion-up': 'accordion-up 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 400ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'slide-up': 'slide-up 500ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'slide-in-right': 'slide-in-right 500ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'pop-in': 'pop-in 500ms cubic-bezier(0.32, 0.72, 0, 1) both',
        'breathe': 'breathe 2.2s cubic-bezier(0.32, 0.72, 0, 1) infinite',
        marquee: 'marquee 32s linear infinite',
        float: 'float 6s cubic-bezier(0.32, 0.72, 0, 1) infinite',
      },

      boxShadow: {
        // Elevation is normally a hairline plus a colour band. Only surfaces
        // that genuinely float over content take a shadow, and it stays soft
        // and neutral so it reads as depth rather than decoration.
        panel: '0 8px 24px -12px rgba(23, 23, 43, 0.28)',
        'panel-lg': '0 20px 50px -20px rgba(23, 23, 43, 0.35)',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
};

export default config;
