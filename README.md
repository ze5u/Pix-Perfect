# PixPerfect

Fix any photo with one upload. A five-tool image editor — restore, fill, remove, recolor, cut out — built with Next.js 15, Clerk, MongoDB Atlas and Cloudinary.

Each edit spends one credit. New accounts get 20.

## Tools

| Tool | Route | What it does |
| --- | --- | --- |
| Image Restore | `/transformations/add/restore` | Lifts speckle and fine scratches from old scans, rebuilds age colour cast |
| Object Remove | `/transformations/add/remove` | Removes a described object, fills the gap with surrounding texture |
| Generative Fill | `/transformations/add/fill` | Outpaints past the image edge in three aspect ratios |
| Object Recolor | `/transformations/add/recolor` | Recolors a named object, preserving shadow and highlight |
| Background Remove | `/transformations/add/removeBackground` | Strips the background in one pass |

Tool definitions live in `constants/index.ts`. Navigation and the marketing page both read from the same `tools` array, so a tool cannot look different in the sidebar than on the landing page.

## Stack

- **Next.js 15** — App Router, server actions, Turbopack dev
- **Clerk** — authentication, synced to Mongo over webhooks
- **MongoDB Atlas** — users, images, credit transactions
- **Cloudinary** — uploads and AI transformations, applied as transform URLs
- **TypeScript**, Tailwind, React Hook Form + Zod, shadcn-style UI components

## Getting started

```bash
git clone <this-repo> && cd Pix-Perfect
npm install
cp .env.example .env
```

Fill `.env` in, then:

```bash
npm run dev        # http://localhost:3000
```

Before the first dev server, set up the three services in this order:

1. **MongoDB Atlas** — create a database user and cluster, copy the connection string into `MONGODB_URL`.
2. **Cloudinary** — create an unsigned upload preset named for your app, with Safe Uploads enabled. The browser uploads through it directly, so it must be unsigned but restricted.
3. **Clerk** — create an application, add the redirect URLs from `.env.example`, then create a webhook. The webhook must point at `https://<your-tunnel-or-domain>/api/webhooks/clerk` and deliver `user.created`, `user.updated` and `user.deleted`. Copy its secret to `WEBHOOK_SECRET`.

### Scripts

```bash
npm run dev         # dev server with Turbopack
npm run build       # production build
npm run start       # serve a production build
npm run lint        # eslint (next/core-web-vitals + next/typescript)
npm run typecheck   # tsc --noEmit
```

## Project structure

```
app/
  (landing)/          marketing page, privacy and terms
  (auth)/             Clerk sign-in and sign-up
  (root)/             authenticated app shell: home, credits, transformations
  api/sync-user/      refreshes the current user's Mongo document
  api/webhooks/clerk/ verifies Svix signature, then syncs the user
components/
  shared/             app-specific components
  ui/                 shadcn-style primitives (button, dialog, select, sheet)
constants/            navigation, tools, pricing tiers, FAQ, credit fee
lib/
  actions/            server actions for images and users
  database/           mongoose connection and the three models
  transform.ts        single source of truth for Cloudinary transform URLs
  schema.ts           JSON-LD generation
middleware.ts         Clerk route protection
types/                shared client-facing types
```

### Data models

- **User** — Clerk email and profile fields, plus a `creditBalance` defaulted to `startingCredits` (20) in the schema.
- **Image** — title, transformation type, Cloudinary `publicId` / `secureURL`, transform URL, and settings for the transform that produced it. The original is always kept alongside the result, so the same tool can be re-run with different settings.
- **Transaction** — a Stripe credit-*purchase* record (`stripeId`, `amount`, `plan`, `credits`, `buyer`). It is defined but not yet written to anywhere; there is no Stripe integration wired up yet, and the credit tiers on `/credits` are display-only.

Spending is handled differently from buying: `updateCredits` in `lib/actions/user.actions.ts` atomically checks `creditBalance >= -creditFee` and then decrements in a single `findOneAndUpdate`, so two rapid edits cannot overdraw a user's last credit. `creditFee = -1` per transformation.

### Webhooks

`/api/webhooks/clerk` verifies the Svix signature before touching the payload — the body is untrusted input from the internet. It then upserts or deletes the matching user document.

This route is deliberately excluded from the `clerkMiddleware` matcher in `middleware.ts`: the request is unauthenticated and verifies itself, so running Clerk's middleware on it would reject every event Clerk sends.

## Notes for contributors

- **`serverExternalPackages`** in `next.config.mjs` keeps `mongodb` and `svix` out of webpack. Both ship native or ESM-only code, and bundling them throws `You are trying to import a file outside of the project` in server actions.
- **Creds in Cloudinary, not in `.env`** for secrets: only the cloud name and unsigned upload preset are `NEXT_PUBLIC_*`. API keys and secret stay server-side.
- **Light-only UI.** `components/ui/sonner.tsx` deliberately avoids `next-themes`; don't add dark-mode variants without changing that assumption.

## Environment

Copy `.env.example`. Every value there is a placeholder; the real file lives in `.env`, which is gitignored. The `.env*` pattern in `.gitignore` is `!.env.example`, so the template is tracked and everything else is not.

Never commit a real `.env`, and never prefix a server secret with `NEXT_PUBLIC_` — those values are shipped to the browser.

## License

Proprietary. All rights reserved.
