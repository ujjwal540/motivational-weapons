# Motivational Weapons

Premium motivational platform — Website + Blog + Daily Motivation + Quotes +
Videos + AI Coach + Admin Dashboard.

## Phase 1 — Project Initialization ✅

This phase set up the base Next.js 15 project with TypeScript, Tailwind CSS,
shadcn/ui config, ESLint, Prettier, and the full folder structure for the
project.

### Tech stack (installed so far)

- Next.js 15.5.18 (App Router, patched — see security note below)
- React 19.2.1 / React DOM 19.2.1 (patched)
- TypeScript 5
- Tailwind CSS 3 + `tailwindcss-animate`
- shadcn/ui config (`components.json`) + `cn()` helper (`lib/utils.ts`)
- ESLint 9 (flat config) with `next/core-web-vitals` + `next/typescript`
- Prettier 3 + `prettier-plugin-tailwindcss`

### Getting started

```bash
npm install
npm run dev      # start local dev server on http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
npm run format   # Prettier --write
```

Copy `.env.example` to `.env.local` and fill in real values before wiring up
Firebase Auth, Cloudinary, and the database (later phases).

## Recommended production setup

For this project, the simplest and most stable path is:

1. **GitHub** as the source repo.
2. **Vercel** for the Next.js app, admin dashboard, and API routes.
3. **Supabase Postgres** for the database.
4. **Firebase Auth** for admin sign-in.

I do **not** recommend splitting the backend to Render for this codebase unless
you later extract a separate service on purpose. This repository already uses
Next.js server actions and route handlers, so keeping frontend + backend in one
Vercel deployment is cleaner, easier to secure, and simpler to debug.

Docker is optional here. Use it only if you want a reproducible local database
or a separate backend container later. It is not required for Vercel deploys.

For a copy-paste Vercel setup checklist, see [docs/vercel-env-checklist.md](docs/vercel-env-checklist.md).
For a ready-to-paste env template, see [docs/production.env.example](docs/production.env.example).

### Deployment checklist

- Push the repository to GitHub.
- Import the repo into Vercel.
- Set the same environment variables from `.env.example` in Vercel.
- Point `DATABASE_URL` and `DIRECT_URL` to your Supabase project.
- Configure Firebase service-account values for admin sessions.
- Disable demo auth in production by leaving `NEXT_PUBLIC_USE_FAKE_AUTH`
  unset.

### Security note

Next.js and React had a series of critical RSC advisories in Dec 2025
(CVE-2025-55182 / CVE-2025-66478) and follow-ups (CVE-2025-55183 /
CVE-2025-55184 / CVE-2025-67779). This project is pinned to `next@15.5.18`
and `react@19.2.1` / `react-dom@19.2.1`, which are patched against all of
these as of this writing. Before deploying, run `npm outdated` and check
https://nextjs.org/blog for newer advisories.

### Folder structure

```
motivational-weapons/
├── app/
│   ├── (public)/
│   │   ├── about/ | videos/ | blog/ | quotes/ | daily-motivation/
│   │   ├── contact/ | privacy/ | terms/ | faq/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── admin/            # placeholders: login, dashboard, analytics, users,
│                     # videos, blogs, quotes, categories, comments,
│                     # newsletter, settings, profile
├── api/              # placeholders: auth, videos, blogs, quotes, upload,
│                     # comments, newsletter, users, analytics, ai
├── components/
│   ├── navbar/ | footer/ | hero/ | cards/ | buttons/ | forms/
│   ├── modal/ | video/ | blog/ | quote/ | dashboard/ | charts/
│   ├── search/ | theme/ | ai/ | ui/          (shadcn components land here)
├── lib/
│   └── utils.ts       # `cn()` class-merge helper for shadcn/ui
├── firebase/          # firebase config + storage helpers (Auth phase)
├── hooks/
├── context/
├── services/          # video/blog/quote/auth/ai/email service layers
├── public/
│   └── images/ | icons/ | videos/ | fonts/ | logo/
├── styles/ | types/ | constants/ | config/ | database/ | scripts/
├── tests/ | docs/
├── components.json     # shadcn/ui config
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── .prettierrc / .prettierignore
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

Empty folders contain a `.gitkeep` placeholder so the intended structure is
preserved in git and future phases have a clear home for their files.

## Phase 1 Verification Checklist

- [x] `npm install` completes cleanly on patched Next.js 15.5.18 / React 19.2.1
- [x] `npm run build` compiles successfully — 0 errors
- [x] `npm run lint` passes — 0 errors, 0 warnings
- [x] Tailwind CSS + design tokens (CSS variables) wired into `globals.css`
- [x] shadcn/ui `components.json` + `lib/utils.ts` (`cn` helper) in place
- [x] Prettier configured with `prettier-plugin-tailwindcss`
- [x] Full folder structure for all planned phases scaffolded
- [x] `.env.example` documents required environment variables
- [x] `.gitignore` excludes `node_modules`, `.next`, `.env*`, build output

## Phase 2 — Core Layout & Design System ✅

**Design plan** (grounded in your Facebook Page's flame-and-sword mark):

- **Palette:** near-black ember bed for dark mode (`hsl(20 16% 6%)`), warm
  parchment for light mode — both paired with a forge-gold primary
  (`hsl(38 82% 56%)`) and flame-orange accent (`hsl(14 82% 52%)`).
- **Type:** Bebas Neue (condensed poster display, self-hosted via
  `@fontsource/bebas-neue` — no external font CDN call at runtime) for
  headlines, Inter Variable for body/UI text.
- **Signature element:** the `.ember-line` — a slow-flickering gold-to-flame
  gradient rule used under the navbar, above the footer legal bar, and as the
  active-nav-link underline. It echoes the logo's flame without repeating the
  icon itself.
- **Dark is the brand default** (`defaultTheme="dark"`), light mode is a
  legible alternate, not an afterthought.

**Built this phase:**

- `components/theme/theme-provider.tsx` + `theme-toggle.tsx` — `next-themes`
  wired to `class` strategy, light/dark/system, no hydration flash
- `components/navbar/navbar.tsx` + `brand-mark.tsx` — sticky, blurred,
  active-link ember underline, mobile `Sheet` menu
- `components/footer/footer.tsx` — explore/company/legal link groups, social
  icons, your real phone number, legal bar
- Base shadcn/ui primitives: `button`, `card`, `badge`, `separator`,
  `dropdown-menu`, `sheet` — plus an `ember` variant added to `button` and
  `badge` for brand CTAs
- Updated `app/globals.css` + `tailwind.config.ts` with the full token system
  above (light + dark), `font-display`/`font-sans` families, and the
  `ember-line` utility
- `app/layout.tsx` now renders `ThemeProvider → Navbar → {children} → Footer`
- `app/page.tsx` restyled as a first proof-of-concept using the new system

### Phase 2 Verification Checklist

- [x] `npm run build` — 0 errors
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npx prettier --check .` — all files formatted
- [x] Dark/light/system theme toggle, no hydration mismatch (`mounted` guard)
- [x] Navbar responsive: desktop inline nav, mobile `Sheet` drawer
- [x] Footer responsive 4-column → stacked
- [x] Fonts self-hosted (no external font requests at build or runtime)
- [x] All new components typed, no `any`, pass ESLint's `@typescript-eslint`
      rules

## Phase 3 — Public Pages ✅

Static content and layouts for every public-facing page. No database or CMS
yet — content lives in typed arrays under `constants/`, which the admin
dashboard will replace with real data in a later phase.

**Pages built:**

- **Home** (`app/page.tsx`) — full hero buildout: hero, stats bar, 3 pillars,
  today's featured quote + featured video, testimonials, newsletter CTA
- **About** (`/about`) — story, mission line, 4 value cards
- **Daily Motivation** (`/daily-motivation`) — interactive quote panel
  (client component: "New Quote" cycles a random quote, "Share" uses the
  Web Share API with a clipboard-copy fallback) + this week's quote strip
  with today highlighted
- **Quotes** (`/quotes`) — client-side category filter over the full quote
  set (Discipline, Resilience, Success, Focus, Self-Belief)
- **Videos** (`/videos`) — platform tabs (All / YouTube / Facebook Reels /
  Shorts) over placeholder video cards (gradient thumbnail, no external
  images/copyrighted content)
- **Blog** (`/blog` + `/blog/[slug]`) — featured post + grid, dynamic post
  route with `generateStaticParams`/`generateMetadata`, all 6 posts
  pre-rendered at build time
- **Contact** (`/contact`) — contact details, socials, and a fully validated
  form (`react-hook-form` + `zod`) with a simulated submit (no `/api/contact`
  route yet — that lands with the backend phase)
- **FAQ** (`/faq`) — accordion Q&A
- **Privacy** / **Terms** — placeholder legal pages so no nav/footer link
  404s before the real copy is finalized

**New shared components:** `PageHeader`, `QuoteCard`, `VideoCard`,
`BlogCard`, `TestimonialCard`, `ContactForm`, `DailyQuotePanel`,
`QuotesGrid`, plus base primitives `Input`, `Textarea`, `Label`, `Tabs`,
`Accordion`, `Avatar`.

### Phase 3 Verification Checklist

- [x] `npm run build` — 19/19 routes compile, 0 errors (6 blog posts
      pre-rendered via `generateStaticParams`)
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npx prettier --check .` — all files formatted
- [x] Every nav/footer link resolves to a real page (no 404s)
- [x] Contact form validates client-side (Zod) before "submitting"
- [x] All interactive pieces (quote panel, quote filter, video tabs, FAQ
      accordion, theme toggle) are isolated `"use client"` components; pages
      stay server components for metadata + static generation
- [x] No external image/font network calls — video thumbnails are CSS
      gradients, fonts are self-hosted via `@fontsource`

## Phase 4 — Database & Prisma Schema ✅

**Datasource:** PostgreSQL via Supabase, using both a pooled connection
(`DATABASE_URL`, pgbouncer/6543 — for the app at runtime) and a direct
connection (`DIRECT_URL`, 5432 — for Prisma migrations), as recommended for
serverless/Vercel deployments.

**Models:** `User` (roles + block flag; auth identity itself is Firebase,
Phase 5), `Category`, `Tag`, `Quote`, `Video`, `BlogPost`, `Comment`,
`NewsletterSubscriber`, `ContactMessage`, `PageView` (first-party analytics
for the admin dashboard). Enums: `Role`, `PostStatus`, `VideoPlatform`,
`CommentStatus`, `ContactStatus`.

**Files added:**

- `prisma/schema.prisma` — the full data model above, with indexes on every
  foreign key and status field the admin dashboard will filter/sort by
- `prisma.config.ts` — Prisma's new (GA) TypeScript config, replacing the
  deprecated `package.json#prisma` key
- `lib/prisma.ts` — `PrismaClient` singleton (prevents connection-pool
  exhaustion from Next.js dev hot-reloads)
- `prisma/seed.ts` — seeds the database with the **exact same content**
  already shown on the Phase 3 static pages (quotes, videos, blog posts, plus
  an admin user and derived categories), so switching pages over to real
  data later doesn't change what visitors see
- `package.json` scripts: `db:generate`, `db:push`, `db:migrate`, `db:seed`,
  `db:studio`
- `.env.example` updated with `DATABASE_URL` + `DIRECT_URL` placeholders

### ⚠️ A note on this environment

I authored, formatted, and manually reviewed the schema and seed script, but
**I could not run `prisma generate` / `db push` / `db seed` from this
sandbox** — Prisma downloads its query-engine binaries from
`binaries.prisma.sh` at install/generate time, and this sandbox's network
allowlist only permits npm/pip registries (by design, for security). That
domain will be reachable on your machine or in CI, so this isn't a problem
with the schema — just something this sandbox can't do on your behalf.

**Run these once you have a real Supabase project:**

```bash
cp .env.example .env.local        # fill in your Supabase connection strings
npm run db:generate               # generates the typed Prisma Client
npm run db:migrate                # creates the tables (prompts for a migration name)
npm run db:seed                   # loads the same content as the Phase 3 pages
npm run db:studio                 # optional: browse the data in Prisma Studio
```

Until `db:generate` runs, `prisma/seed.ts` is intentionally excluded from
the Next.js TypeScript check (see `tsconfig.json`) since it imports
schema-derived types (`Role`, `VideoPlatform`, `PostStatus`) that don't
exist until generation — this keeps `npm run build` green in the meantime.
`lib/prisma.ts` is unaffected since it only uses the client's generic type.

### Phase 4 Verification Checklist

- [x] `npm run build` — 19/19 routes, 0 errors (unchanged from Phase 3)
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npx prettier --check .` — all files formatted
- [x] Schema manually reviewed: every relation has matching
      `fields`/`references`, every optional 1-1 relation has a `@unique` FK,
      sensible `onDelete` behavior (`Cascade` for comments, `SetNull`
      elsewhere so deleting a category/author doesn't delete content)
- [x] `prisma.config.ts` uses the current GA config format (no deprecation
      warnings)
- [x] Seed data is idempotent (`upsert` everywhere — safe to re-run)
- [ ] `prisma generate` / `db push` / `db seed` — **cannot run in this
      sandbox** (network-restricted); run locally per the note above

## Phase 5 — Authentication ✅

Firebase Authentication (email/password + Google) wired to real sessions and
the `User` model from Phase 4, gating `/admin/*`.

**How it works:**

1. The client signs in with the Firebase JS SDK (email/password or Google
   popup) and gets back an ID token.
2. That token is POSTed to `/api/auth/session`, which verifies it with
   Firebase Admin, upserts the matching `User` row (new sign-ins default to
   the `USER` role), and mints a Firebase **session cookie** — set as
   `httpOnly`, `secure` (in production), `sameSite=lax`.
3. Every protected page calls `requireAdmin()` (`lib/auth.ts`), which
   verifies that cookie server-side, loads the `User` row, and redirects to
   `/admin/login` unless the role is `ADMIN` and the account isn't blocked.
4. `middleware.ts` does a **fast, cookie-presence-only** redirect for `/admin/*`
   as a UX nicety — it can't call Firebase Admin (Edge runtime, Node-only
   APIs), so the real security boundary is always `requireAdmin()`, not the
   middleware.

**Files added:**

- `firebase/config.ts` — client SDK, lazily initialized (see note below)
- `firebase/admin.ts` — Admin SDK, lazily initialized from service-account
  env vars, marked `server-only` so it can never end up in a client bundle
- `context/auth-context.tsx` — `AuthProvider`/`useAuth()`:
  `signInWithEmail`, `signUpWithEmail`, `signInWithGoogle`, `signOutUser`
- `lib/auth.ts` — `getCurrentUser()` / `requireAdmin()`
- `lib/session-cookie.ts` — the cookie-name constant, deliberately
  dependency-free so Edge middleware can import it without pulling in
  Node-only Firebase Admin/Prisma code
- `app/api/auth/session/route.ts` — POST creates the session + upserts the
  user, DELETE clears it
- `app/admin/login/page.tsx` + `components/forms/admin-login-form.tsx` —
  tabbed sign in / sign up form plus a Google button
- `app/admin/dashboard/page.tsx` — the **first protected page**, calls
  `requireAdmin()` and confirms the whole flow end-to-end (full dashboard
  UI is Phase 6)
- `middleware.ts`

**Structural fix from Phase 1:** `admin/` and `api/` had been scaffolded at
the project root instead of inside `app/`, where the App Router requires
them to actually become routes. Moved both in this phase — no route
behavior changes, but it's why you'll see them appear "for the first time"
here even though the folders existed since Phase 1. Also split the root
layout: `app/layout.tsx` now only sets up `<html>`/`<body>` and the
Theme/Auth providers, while `app/(public)/layout.tsx` renders the Navbar and
Footer — so `/admin/*` doesn't inherit the public site chrome.

### Two lazy-initialization fixes worth knowing about

Both Firebase's client SDK and `@prisma/client` validate/construct
themselves the moment they're used, not just when they're imported — and
`next build` actually _executes_ route handlers and prerendered pages (not
just type-checks them) to collect page data. With placeholder or missing
credentials (exactly the situation before you've created a real Firebase
project or run `prisma generate`), that meant the build itself would crash.

Both `lib/prisma.ts` and `firebase/config.ts` now hand back a `Proxy` that
defers the real `new PrismaClient()` / `getAuth()` call until the first
actual property access — which only happens at request time in real usage
(a query, a sign-in click), never during static generation. This is what
kept `npm run build` green through this phase without a live database or a
real Firebase project.

### ⚠️ Still can't run in this sandbox

Same limitation as Phase 4: I couldn't run `prisma generate` here (blocked
`binaries.prisma.sh`), and I don't have a real Firebase project to sign in
against. Once you've done both:

```bash
cp .env.example .env.local   # fill in Firebase + Supabase values
npm run db:generate
npm run dev
# visit /admin/login, create an account, then in Prisma Studio or SQL:
#   UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
```

That last step is deliberate — every new sign-in defaults to `USER` so
nobody can self-promote to admin through the sign-up form.

### Phase 5 Verification Checklist

- [x] `npm run build` — 22/22 routes, 0 errors; `/admin/dashboard` and
      `/api/auth/session` correctly marked dynamic (ƒ), everything else
      still static
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npx prettier --check .` — all files formatted
- [x] `requireAdmin()` is the real security boundary; middleware is
      cookie-presence UX only and documented as such in its own comments
- [x] Session cookie is `httpOnly` + `sameSite=lax` + `secure` in production
- [x] New sign-ups default to `USER`, never `ADMIN`
- [x] `firebase/admin.ts` is `server-only` — cannot be imported into a
      client component or bundle
- [ ] Live sign-in flow — **needs a real Firebase project**, can't be
      exercised in this sandbox

## Phase 6 — Admin Dashboard Core ✅

The admin dashboard shell, live analytics, and full CRUD for Quotes, Videos,
and Blog Posts — every screen reads from and writes to the Prisma models
from Phase 4, gated by the `requireAdmin()` check from Phase 5.

**Shell:**

- `app/admin/(dashboard)/layout.tsx` — the one place `requireAdmin()` is
  called for this whole route group; wraps everything in `AdminShell`
- `components/dashboard/admin-shell.tsx` — desktop sidebar + mobile `Sheet`
  drawer, topbar with the signed-in user's name, theme toggle, sign out
- `constants/admin-nav.ts` — single source of truth for the sidebar's 10
  sections (used by both the desktop and mobile nav)

**Dashboard overview** (`/admin/dashboard`) — live counts (quotes, videos,
posts, users, pending comments, active subscribers) via `Promise.all` +
`prisma.*.count()`, plus quick links into each content type.

**Analytics** (`/admin/analytics`) — first-party, no third-party tracker:
a `PageViewTracker` client component (mounted in `app/(public)/layout.tsx`)
pings `/api/analytics/track` on every route change, which writes a
`PageView` row. The analytics page then aggregates that into a 14-day bar
chart (`recharts`), all-time totals, and a top-pages table via
`prisma.pageView.groupBy()`.

**CRUD — Quotes, Videos, Blog Posts** (`/admin/quotes`, `/admin/videos`,
`/admin/blogs`, each with `new/` and `[id]/edit/`): list → create → edit →
delete, all via **Server Actions** (`actions.ts` per section) rather than
separate API routes — the modern App Router pattern. Every action:

1. Calls `requireAdmin()` itself (defense in depth — never trusts that the
   layout already checked)
2. Validates with `zod`
3. Writes with Prisma, then `revalidatePath()` so the list is fresh
4. Forms use `useActionState` + `useFormStatus` (React 19) for pending
   states and field-level errors without any client-side data-fetching
   library

**Categories** (`/admin/categories`) — the shared taxonomy every quote,
video, and post can attach to: inline add form + list with per-model usage
counts + delete. Comments, Users, Newsletter, and Settings get an
`AdminComingSoon` placeholder for now — their sidebar links work, but full
screens for those come in the next phase.

### Two real bugs worth flagging (fixed this phase)

- **Structural, from Phase 1:** `admin/` and `api/` had been scaffolded at
  the project root instead of inside `app/` — caught and fixed in Phase 5,
  mentioned again here because it's the reason these routes work at all.
- **Missing `--popover` token:** `components/ui/select.tsx` (needed for the
  category dropdowns in every form this phase) uses `bg-popover
text-popover-foreground`, but those CSS variables were never defined in
  `globals.css` — every select dropdown would have rendered with a
  transparent background. Added `--popover`/`--popover-foreground` (light
  - dark) and the matching Tailwind color mapping.

### A recurring TypeScript quirk with the pre-generation Prisma stub

Every list page (`quotes`, `videos`, `blogs`, `categories`, plus
`topPaths`/`deviceCounts` on the analytics page) does `await
prisma.model.findMany(...)` and then `.map()`s over the result in JSX. With
the client generated, this is fully typed and fine. Without it — this
sandbox's situation — `PrismaClient` is typed `any`, and it turns out
`arrayOfAny.map((row) => ...)` **does** trigger `noImplicitAny` under
`strict: true` (an `any`-typed array's inferred element still needs an
explicit callback parameter type in some TS versions, unlike a bare `any`
value). Fixed by adding a small explicit interface at each query call site
(e.g. `const quotes: QuoteRow[] = await prisma.quote.findMany(...)`) —
these interfaces match the real shape Prisma will generate, so they cost
nothing once `prisma generate` has run for real; they're just doing its job
early.

### ⚠️ Still can't run in this sandbox

Same as Phases 4–5: no live database, so none of the Prisma queries this
phase depends on have actually executed against real data — I've verified
every query against `prisma/schema.prisma` by hand instead. Once you've run
`db:generate` + `db:migrate` + `db:seed` (Phase 4) and created an admin user
(Phase 5), every screen in this phase should work immediately against that
seeded data.

### Phase 6 Verification Checklist

- [x] `npm run build` — 36/36 routes, 0 errors (all `/admin/*` content
      routes correctly dynamic; public routes still static)
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npx prettier --check .` — all files formatted
- [x] Every Server Action re-checks `requireAdmin()` independently of the
      layout guard
- [x] Every list page handles the empty state (no quotes/videos/posts yet)
      instead of rendering a blank table
- [x] Delete actions require a native `confirm()` before firing
- [x] Sidebar links for not-yet-built sections (Comments, Users,
      Newsletter, Settings) resolve to a real page, not a 404
- [ ] Actually exercising the CRUD against real data — **needs the database
      from Phase 4 set up locally**

## Phase 7 — Comments, Users & Newsletter ✅

Public comment submission with admin moderation, full user management
(promote/demote, block/unblock), and a working newsletter signup with a
subscriber list + CSV export.

**A key architectural decision this phase:** `/blog/[slug]` is still
statically generated from `constants/blog-posts.ts` (`generateStaticParams`,
built once at build time) — it was never migrated to read live from
Postgres, which means comments couldn't be fetched in the page component
itself without reintroducing a database dependency into the build (the
same class of problem as the Phase 5/6 lazy-Prisma fixes, but this time
there's no clever proxy trick that helps — a `.findMany()` call is a real
query, not just a construction). So comments are handled entirely
**client-side at runtime**: a `CommentsSection` component fetches
`/api/comments?slug=...` on mount and posts new comments to the same route
— the static page shell never touches Prisma, only a real visitor's browser
does, after the build is long finished.

**Public comments** (`/blog/[slug]`):

- `app/api/comments/route.ts` — `GET` resolves `slug` → `BlogPost.id` →
  approved comments; `POST` requires a signed-in user (`getCurrentUser()`,
  not `requireAdmin()` — any signed-in reader, not just admins), creates a
  `Comment` with `status: PENDING`
- `components/blog/comments-section.tsx` — the client component above;
  shows a "Sign in to comment" prompt (linking to the new `/login` page)
  when signed out, a textarea when signed in, and an honest "awaiting
  approval" message on submit rather than optimistically showing the
  unapproved comment
- `app/(public)/login/page.tsx` — a **public** sign-in page (distinct from
  `/admin/login`), reusing the same `AuthForm` component, with a `?next=`
  redirect back to whatever page sent the reader here

**Admin moderation** (`/admin/comments`) — every comment regardless of
status, sorted pending-first, with Approve/Reject/Delete actions.

**Users** (`/admin/users`) — every signed-in account with Promote/Demote
and Block/Unblock actions. Both server actions refuse to let an admin
modify their own account (`if (id === currentUser.id) throw`), and the row
for the signed-in admin shows "This is you" instead of action buttons —
you can't lock yourself out.

**Newsletter** — the homepage signup form is now wired to a real
`subscribeToNewsletter` server action (it was a non-functional `<form>`
before this phase) that upserts a `NewsletterSubscriber` row. `/admin/newsletter`
lists every subscriber with Unsubscribe/Resubscribe/Delete actions, plus an
**Export CSV** button hitting `/api/newsletter/export` — a `requireAdmin()`-gated
route handler that streams a `text/csv` response.

### Two bugs caught and fixed this phase

- **`components/ui/badge.tsx` had no `destructive` variant.** Needed one for
  "Rejected" comments and "Blocked" users. Added it using the `--destructive`
  token that already existed (from the Input/Textarea error-text styling)
  but had never been wired into Badge.
- **Same pre-generation Prisma `.map()` quirk from Phase 6** hit the new
  `/api/comments` and `/api/newsletter/export` routes. Fixed the same way —
  explicit interfaces at the query call site.

### ⚠️ Still can't run in this sandbox

Same as every phase since 4: no live database here, so none of this
phase's queries have executed against real data. Once your database is
seeded and you're signed in as a reader (not just an admin), the comment
form, moderation queue, user actions, and CSV export should all work
immediately.

### Phase 7 Verification Checklist

- [x] `npm run build` — 39/39 routes, 0 errors; `/blog/[slug]` still SSG
      (confirms comments didn't reintroduce a build-time DB dependency)
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npx prettier --check .` — all files formatted
- [x] `POST /api/comments` rejects unauthenticated requests (401) before
      touching the database
- [x] New comments default to `PENDING` — never visible publicly until an
      admin approves them
- [x] Admin can't demote, block, or otherwise touch their own account
- [x] `/api/newsletter/export` re-checks `requireAdmin()` independently
      (API routes aren't covered by the admin layout's guard)
- [ ] Actually exercising any of this against real data — **needs the
      database from Phase 4 set up locally**

## Phase 8 — SEO Panel & Site Settings ✅

`sitemap.xml`, `robots.txt`, Open Graph/Twitter defaults, and a real
`/admin/settings` screen backed by a new `SiteSettings` model.

**An explicit scope boundary, not a sandbox limitation this time:** the
admin Settings form genuinely reads and writes a real database row — it's
not a placeholder. What it does _not_ yet do is feed back into the public
site's rendering (logo, social links, site name shown to visitors). That's
a deliberate choice: `/blog/[slug]` and most public pages are statically
generated at build time (Phases 3 & 7 leaned on this deliberately to keep
the sandbox's lack of a live database from blocking `npm run build`).
Making the public layout/Navbar/Footer read live settings would force that
whole route segment to render dynamically on every request, trading away
the static-generation performance win for something the site doesn't
strictly need yet. So: the settings are real and saved, but wiring the
public pages to consume them is called out below as explicit follow-up
work, not hidden as a limitation.

**Built:**

- `prisma/schema.prisma` — `SiteSettings`, a deliberate singleton (always
  looked up by a fixed id, never a real multi-row table): site name,
  tagline, logo/hero banner URLs, contact info, social links, and SEO
  defaults (meta title/description, OG image, Twitter handle)
- `lib/settings.ts` — `getSiteSettings()`, which upserts-on-read so the
  admin page always has a row to render even before anyone's saved
  anything
- `app/admin/(dashboard)/settings/` — real tabbed form (General / SEO /
  Social) replacing the Phase 6 "coming soon" stub, `actions.ts` validates
  with `zod` and upserts the singleton row
- `app/sitemap.ts` — built from `constants/blog-posts.ts`, **not** a Prisma
  query, for the same static-generation reason as everything else this
  phase
- `app/robots.ts` — disallows `/admin` and `/api`, points at the sitemap
- `app/opengraph-image.tsx` — a branded default OG image generated with
  `next/og`'s `ImageResponse` (no external font fetch, so it renders fine
  offline and stays statically generated rather than per-request)
- `app/layout.tsx` — added `metadataBase`, `openGraph`, and `twitter`
  defaults so every page's OG/Twitter cards resolve correctly even before
  a page sets its own

### Phase 8 Verification Checklist

- [x] `npm run build` — 42/42 routes, 0 errors; `sitemap.xml`, `robots.txt`,
      and `opengraph-image` all statically generated (○), confirming none
      of them introduced a build-time database dependency
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npx prettier --check .` — all files formatted
- [x] Settings form validates URLs/emails with `zod` before saving
- [x] `/admin/settings` re-checks `requireAdmin()` in its own server action
- [ ] Public pages actually reading these settings — **explicit follow-up
      work**, not a limitation of this environment (see above)

## Phase 9 — AI Motivation Coach ✅

A streaming chat page backed by the **Groq API** (switched from Anthropic
at your request, to keep this feature on a free tier), gated behind
sign-in the same way comments are, with a system prompt grounded in the
site's own voice and firm safety boundaries.

**Files added:**

- `lib/ai-coach.ts` — the system prompt (pulled from the actual About-page
  copy: struggle-as-fuel, discipline-over-mood, no-toxic-positivity) plus a
  lazily-constructed `Groq` client (same reasoning as the Firebase/Prisma
  lazy-Proxy pattern from earlier phases — nothing calls the SDK
  constructor at module-load time)
- `app/api/ai/chat/route.ts` — `POST`, requires `getCurrentUser()` (any
  signed-in reader, same bar as commenting), validates the conversation
  with `zod` (capped at 20 messages / 4000 chars each — this is a real API
  call per request, so an unbounded body is a real cost/abuse vector even
  on a free tier with rate limits), then streams the reply back as
  `text/plain`
- `components/ai/coach-chat.tsx` — the chat UI: message bubbles, starter
  prompts on the empty state, streams the assistant's reply token-by-token
  into the UI as it arrives (reads the response body with a
  `ReadableStreamDefaultReader`, no extra streaming library), and shows a
  "Sign in to talk to the coach" gate when signed out — same UX pattern as
  the Phase 7 comments gate
- `app/(public)/ai-coach/page.tsx` — added to both the Navbar and Footer
  nav links

**Model:** defaults to `llama-3.3-70b-versatile` on Groq's free tier,
overridable via `GROQ_MODEL` so switching models later is a one-line env
change, not a code change.

### Why Groq instead of Anthropic

You asked to move off the Claude API since it isn't free — Groq's free
tier (generous rate limits, very fast inference on Llama models) is a
better fit for a personal/portfolio project like this one. The swap only
touched two files (`lib/ai-coach.ts` and `app/api/ai/chat/route.ts`) since
the chat UI just talks to `/api/ai/chat` and never touches the model
provider directly — that boundary is exactly why the swap was contained
rather than a rewrite.

**What actually changed under the hood:** Anthropic's Messages API takes a
separate `system` parameter and its streaming SDK exposes an event-emitter
(`stream.on("text", ...)`). Groq's API is **OpenAI-compatible** instead —
the system prompt is just the first message in the `messages` array with
`role: "system"`, and the stream is a plain `for await (const chunk of
stream)` loop where each chunk's text lives at
`chunk.choices[0]?.delta?.content`. I checked the real `.d.ts` files in
`node_modules/groq-sdk` rather than assuming the shape carried over from
Anthropic's SDK, since the two are genuinely different APIs.

### ⚠️ Can't exercise this in the sandbox either

No `GROQ_API_KEY` is configured here, and this sandbox's network allowlist
doesn't include Groq's API domain anyway — so, like the database and
Firebase project in every phase since 4, I haven't been able to send a
real message through this and watch it stream back. I read the actual SDK
type definitions rather than relying on memory to get the request/response
shape right, but you'll want to smoke-test a real conversation once
`GROQ_API_KEY` is set (free at console.groq.com).

### Phase 9 Verification Checklist

- [x] `npm run build` — 44/44 routes, 0 errors; `/ai-coach` static, `/api/ai/chat`
      correctly dynamic
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npx prettier --check .` — all files formatted
- [x] `POST /api/ai/chat` rejects unauthenticated requests (401) and
      oversized/malformed bodies (400) before ever calling Groq
- [x] Conversation length and per-message length are both capped
- [x] System prompt has an explicit crisis-response instruction (redirect
      to 988 / local emergency services, drop the coaching tone) rather
      than leaving that to chance
- [ ] An actual streamed conversation — **needs `GROQ_API_KEY`**, which
      this sandbox doesn't have

## Next Phase

Say **"Next Phase"** to continue building — the original spec's remaining
pieces are Search, Testimonials management, and the future-monetization
groundwork (AdSense/affiliate/membership placeholders), or say what you'd
like prioritized next.
