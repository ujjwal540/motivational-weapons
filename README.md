<div align="center">

# 🔥⚔️ Motivational Weapons

### *Discipline over mood. Struggle as fuel. No toxic positivity.*

**A premium motivational platform** — Website · Blog · Daily Motivation · Quotes · Videos · AI Coach · Admin Dashboard

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-motivationalweapons.vercel.app-14824A?style=for-the-badge)](https://motivationalweapons.vercel.app/)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15.5.18-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-Postgres-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3-F55036?style=flat-square)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Recommended Production Setup](#️-recommended-production-setup)
- [Folder Structure](#-folder-structure)
- [Build Log — Phases 1 through 9](#-build-log)
- [Current Features](#-current-features)
- [Automation](#-automation)
- [Security Note](#-security-note)

---

## ✨ Overview

**Motivational Weapons** is a full-stack Next.js 15 platform built phase by
phase — public marketing site, blog, quotes and videos library, a daily
motivation panel, a Groq-powered AI coach, and a complete admin dashboard
with real database-backed CRUD, moderation, analytics, and site settings.

Every phase below shipped with a green build, a clean lint pass, and a
verification checklist — nothing marked "done" without proof.

| 🎨 Premium dark UI | 🗄️ Real Postgres + Prisma | 🔐 Firebase-gated admin | 🤖 Public AI coach |
|:---:|:---:|:---:|:---:|
| Ember/flame token system, dark by default | 10 models, fully seeded | Session cookies, role-based access | Groq · Llama 3.3 · free tier |

---

## 🌐 Live Demo

<div align="center">

### 👉 **[motivationalweapons.vercel.app](https://motivationalweapons.vercel.app/)** 👈

</div>

| Page | What to try |
|---|---|
| `/` | The full hero build — stats bar, pillars, featured quote & video, testimonials |
| `/daily-motivation` | Hit **"New Quote"** to cycle, then **"Share"** (Web Share API) |
| `/quotes` | Filter by category — Discipline, Resilience, Success, Focus, Self-Belief |
| `/videos` | YouTube-only motivation library with featured playback cards |
| `/blog` | Full blog with statically generated post pages |
| `/ai-coach` | Ask the public AI Coach for practical support without signing in |
| `/admin/login` | Admin dashboard entry point (role-gated) |

---

## 🛠️ Tech Stack

<table>
<tr><td><b>Framework</b></td><td>Next.js 15.5.18 (App Router, patched)</td></tr>
<tr><td><b>UI</b></td><td>React 19.2.1 · TypeScript 5 · Tailwind CSS 3 · shadcn/ui</td></tr>
<tr><td><b>Fonts</b></td><td>Bebas Neue (display) + Inter Variable — both self-hosted via <code>@fontsource</code>, zero external font requests</td></tr>
<tr><td><b>Database</b></td><td>PostgreSQL via Supabase, accessed through Prisma (pooled + direct connections)</td></tr>
<tr><td><b>Auth</b></td><td>Firebase Authentication (email/password + Google), server-verified session cookies</td></tr>
<tr><td><b>AI Coach</b></td><td>Groq API · <code>llama-3.3-70b-versatile</code>, OpenAI-compatible streaming</td></tr>
<tr><td><b>Forms & Validation</b></td><td>react-hook-form + zod, React 19 <code>useActionState</code>/<code>useFormStatus</code></td></tr>
<tr><td><b>Charts</b></td><td>Recharts (first-party analytics — no third-party tracker)</td></tr>
<tr><td><b>Tooling</b></td><td>ESLint 9 (flat config) · Prettier 3 + tailwindcss plugin</td></tr>
<tr><td><b>Hosting</b></td><td>Vercel (app + admin + API routes, single deployment)</td></tr>
</table>

---

## 🚀 Getting Started

```bash
npm install
npm run dev      # start local dev server on http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
npm run format   # Prettier --write
```

Copy `.env.example` to `.env.local` and fill in real values before wiring up
Firebase Auth, Supabase, and Groq.

```bash
cp .env.example .env.local
npm run db:generate     # generate the typed Prisma client
npm run db:migrate      # create tables in your Supabase Postgres
npm run db:seed         # load quotes / videos / blog posts + an admin user
npm run db:studio       # optional — browse data visually
```

---

## ☁️ Recommended Production Setup

| Layer | Service |
|---|---|
| Source repo | **GitHub** |
| App + Admin + API routes | **Vercel** (single deployment) |
| Database | **Supabase Postgres** |
| Auth | **Firebase Auth** |

> Splitting the backend to Render isn't recommended for this codebase unless
> a service is deliberately extracted later — this repo leans on Next.js
> Server Actions and route handlers, so one Vercel deployment stays cleaner,
> easier to secure, and simpler to debug.

Docker is optional — useful for a reproducible local database, not required
for a Vercel deploy.

For a copy-paste Vercel setup checklist, see [docs/vercel-env-checklist.md](docs/vercel-env-checklist.md).
For a ready-to-paste env template, see [docs/production.env.example](docs/production.env.example).
For the follow-up checks after deployment, see [docs/post-deploy-checklist.md](docs/post-deploy-checklist.md).

### Vercel paste order

When Vercel asks for environment variables, add them in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `NEXT_PUBLIC_FIREBASE_API_KEY`
3. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
4. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
5. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
6. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
7. `NEXT_PUBLIC_FIREBASE_APP_ID`
8. `DATABASE_URL`
9. `DIRECT_URL`
10. `FIREBASE_PROJECT_ID`
11. `FIREBASE_CLIENT_EMAIL`
12. `FIREBASE_PRIVATE_KEY`
13. `CLOUDINARY_CLOUD_NAME`
14. `CLOUDINARY_API_KEY`
15. `CLOUDINARY_API_SECRET`
16. `GROQ_API_KEY`
17. `GROQ_MODEL`
18. `YOUTUBE_API_KEY`
19. `CRON_SECRET`

Leave `NEXT_PUBLIC_USE_FAKE_AUTH` empty in production.

📄 Setup docs: [`docs/vercel-env-checklist.md`](docs/vercel-env-checklist.md) · [`docs/production.env.example`](docs/production.env.example)

**Deployment checklist**

- [ ] Push the repo to GitHub
- [ ] Import the repo into Vercel
- [ ] Copy every variable from `.env.example` into Vercel's env settings
- [ ] Point `DATABASE_URL` / `DIRECT_URL` at your Supabase project
- [ ] Add Firebase service-account values for admin sessions
- [ ] Leave `NEXT_PUBLIC_USE_FAKE_AUTH` **unset** in production

---

## 📁 Folder Structure

```
motivational-weapons/
├── app/
│   ├── (public)/
│   │   ├── about/ | videos/ | blog/ | quotes/ | daily-motivation/
│   │   ├── ai-coach/ | login/ | contact/ | privacy/ | terms/ | faq/
│   ├── admin/            # login, dashboard, analytics, users, videos,
│   │                      # blogs, quotes, categories, comments,
│   │                      # newsletter, settings
│   ├── api/               # auth, videos, blogs, quotes, comments,
│   │                      # newsletter, analytics, ai
│   ├── layout.tsx | sitemap.ts | robots.ts | opengraph-image.tsx
├── components/
│   ├── navbar/ | footer/ | hero/ | cards/ | forms/ | modal/
│   ├── video/ | blog/ | quote/ | dashboard/ | charts/ | ai/ | ui/
├── lib/                   # prisma.ts, auth.ts, settings.ts, ai-coach.ts …
├── firebase/               # client + admin config
├── prisma/                 # schema.prisma, seed.ts
├── hooks/ | context/ | services/
├── public/ | styles/ | types/ | constants/ | config/
├── tests/ | docs/
└── package.json
```

---

## 🏗️ Build Log

<details>
<summary><b>Phase 1 — Project Initialization</b> ✅</summary>

<br/>

Base Next.js 15 project: TypeScript, Tailwind CSS 3, shadcn/ui config,
ESLint 9 (flat config), Prettier 3, and the full folder structure for every
planned phase (empty folders keep a `.gitkeep` so the structure survives git).

**Checklist**
- [x] `npm install` clean on patched Next.js 15.5.18 / React 19.2.1
- [x] `npm run build` — 0 errors
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] Tailwind + design tokens wired into `globals.css`
- [x] shadcn/ui `components.json` + `cn()` helper in place
- [x] `.env.example` documents every required variable

</details>

<details>
<summary><b>Phase 2 — Core Layout & Design System</b> ✅</summary>

<br/>

Design grounded in the brand's flame-and-sword mark:

- **Palette:** near-black ember bed (`hsl(20 16% 6%)`) for dark mode, warm
  parchment for light — both paired with a forge-gold primary
  (`hsl(38 82% 56%)`) and flame-orange accent (`hsl(14 82% 52%)`)
- **Type:** Bebas Neue for headlines, Inter Variable for body — both
  self-hosted, no font CDN calls at runtime
- **Signature element:** `.ember-line` — a slow gold-to-flame gradient rule
  under the navbar, above the footer, and as the active-nav underline
- **Dark is the brand default**, light is a legible alternate

Built: theming (`next-themes`, no hydration flash), sticky/blurred navbar
with mobile `Sheet` menu, footer with real contact info, base shadcn/ui
primitives plus a custom `ember` variant for brand CTAs.

**Checklist**
- [x] `npm run build` / `lint` / `prettier --check` all clean
- [x] Dark/light/system toggle, no hydration mismatch
- [x] Navbar responsive (desktop inline → mobile drawer)
- [x] Fonts self-hosted, zero external requests
- [x] No `any` types, full ESLint + `@typescript-eslint` pass

</details>

<details>
<summary><b>Phase 3 — Public Pages</b> ✅</summary>

<br/>

Every public page, statically generated, content in typed arrays under
`constants/` (swapped for real data in Phase 4+):

**Home** · full hero, stats bar, 3 pillars, featured quote/video,
testimonials, newsletter CTA
**About** · story, mission, 4 value cards
**Daily Motivation** · interactive quote panel ("New Quote" cycles randomly,
"Share" uses the Web Share API with clipboard fallback)
**Quotes** · client-side category filter
**Videos** · YouTube-only motivation library with automatic channel syncing
and graceful fallback links when the database is empty
**Blog** · featured post + grid, dynamic `[slug]` route with
`generateStaticParams` — all posts pre-rendered at build time
**Contact** · `react-hook-form` + `zod` validated form
**FAQ** · accordion Q&A · **Privacy/Terms** · placeholder legal pages

**Checklist**
- [x] Production build compiles all public, admin, API, and legacy routes
- [x] Every nav/footer link resolves — zero 404s
- [x] Contact form validates client-side before "submitting"
- [x] Interactive pieces isolated as `"use client"`; pages stay server
      components for metadata + static generation
- [x] Zero external image/font network calls

</details>

## ✨ Current Features

- Premium dark-first interface with cyan/violet accents, glass panels, responsive
  navigation, floating hero cards, hover elevation, and reduced-motion support.
- Public AI Coach with quick prompts, streaming Groq responses, and a local
  practical-motivation fallback when the AI provider is unavailable.
- Quotes with copy/share actions, YouTube-only video cards, generated blog cover
  art, fallback content for empty databases, and responsive mobile layouts.

## ⏱️ Automation

Vercel Cron runs the content system without manual publishing:

- `06:00 UTC`: publishes the morning quote, syncs the latest YouTube uploads,
  and creates one Groq-generated article with a branded OG image.
- `21:00 UTC`: publishes a separate good-night quote.

Both jobs revalidate the homepage, motivation, quotes, videos, and blog routes.
Set `CRON_SECRET`, `DATABASE_URL`, `GROQ_API_KEY`, and `YOUTUBE_API_KEY` in
Vercel before deploying. Cron times are UTC; Nepal time is UTC+5:45.

<details>
<summary><b>Phase 4 — Database & Prisma Schema</b> ✅</summary>

<br/>

**Datasource:** Supabase Postgres — pooled connection (`DATABASE_URL`,
pgbouncer/6543) for runtime, direct connection (`DIRECT_URL`, 5432) for
migrations — the standard pattern for serverless/Vercel.

**Models:** `User`, `Category`, `Tag`, `Quote`, `Video`, `BlogPost`,
`Comment`, `NewsletterSubscriber`, `ContactMessage`, `PageView`, plus
`Role`/`PostStatus`/`VideoPlatform`/`CommentStatus`/`ContactStatus` enums.

`prisma/seed.ts` loads the **exact same content** already shown on the
Phase 3 static pages, so switching pages to real data later changes nothing
visitors see.

> ⚠️ **Sandbox note:** `prisma generate`/`db push`/`db seed` need
> `binaries.prisma.sh`, outside this environment's network allowlist. Fully
> reviewed by hand instead — runs immediately once you have a real Supabase
> project:
> ```bash
> cp .env.example .env.local
> npm run db:generate && npm run db:migrate && npm run db:seed
> ```

**Checklist**
- [x] `build`/`lint`/`prettier` all clean with the current App Router surface
- [x] Every relation has matching `fields`/`references`; sensible
      `onDelete` behavior (`Cascade` for comments, `SetNull` elsewhere)
- [x] Seed data is idempotent (`upsert` everywhere)
- [ ] Actually running `generate`/`push`/`seed` — **do this locally**

</details>

<details>
<summary><b>Phase 5 — Authentication</b> ✅</summary>

<br/>

Firebase Auth (email/password + Google) wired to real sessions, gating
`/admin/*`:

1. Client signs in via Firebase JS SDK → gets an ID token
2. Token POSTed to `/api/auth/session` → verified via Firebase Admin →
   upserts the `User` row → mints an `httpOnly`/`secure`/`sameSite=lax`
   session cookie
3. Every protected page calls `requireAdmin()` server-side
4. `middleware.ts` does a fast cookie-presence redirect as a UX nicety only
   — the real security boundary is always `requireAdmin()`

**Two lazy-initialization fixes:** both Firebase's client SDK and
`@prisma/client` validate themselves the moment they're used — and
`next build` actually executes route handlers to collect page data. With
placeholder credentials, that crashed the build. Fix: both `lib/prisma.ts`
and `firebase/config.ts` return a `Proxy` that defers real construction
until first property access, which only happens at real request time.

> ⚠️ Same sandbox limitation as Phase 4, plus no real Firebase project to
> sign in against here. New sign-ups always default to `USER` — nobody
> self-promotes to admin through the sign-up form; promotion happens via a
> manual SQL/Studio update.

**Checklist**
- [x] 22/22 routes; `/admin/dashboard` + `/api/auth/session` correctly dynamic
- [x] Session cookie `httpOnly` + `sameSite=lax` + `secure` in production
- [x] `firebase/admin.ts` marked `server-only`
- [ ] Live sign-in flow — **needs a real Firebase project**

</details>

<details>
<summary><b>Phase 6 — Admin Dashboard Core</b> ✅</summary>

<br/>

Full admin shell + live analytics + CRUD for Quotes, Videos, and Blog Posts.

- **Shell:** desktop sidebar + mobile drawer, topbar with theme toggle & sign out
- **Overview:** live counts via `Promise.all` + `prisma.*.count()`
- **Analytics:** first-party page-view tracker (no third-party script) →
  14-day Recharts bar chart, all-time totals, top-pages table
- **CRUD:** Quotes/Videos/Blogs all via **Server Actions**, each
  independently re-checking `requireAdmin()`, validating with `zod`, then
  `revalidatePath()`. Forms use React 19's `useActionState`/`useFormStatus`
- **Categories:** shared taxonomy with per-model usage counts

**Bugs fixed this phase:** the `admin/`/`api/` folders had been scaffolded
outside `app/` since Phase 1 (moved); `select.tsx` was missing
`--popover`/`--popover-foreground` tokens (dropdowns would've rendered
transparent).

**Checklist**
- [x] 36/36 routes; all `/admin/*` content routes correctly dynamic
- [x] Every Server Action re-checks `requireAdmin()` independently
- [x] Empty states handled everywhere; deletes require `confirm()`
- [ ] Exercising CRUD against real data — **needs Phase 4's database live**

</details>

<details>
<summary><b>Phase 7 — Comments, Users & Newsletter</b> ✅</summary>

<br/>

Public comment moderation, user management, and a working newsletter.

**Key decision:** `/blog/[slug]` stays statically generated, so comments
are fetched/posted entirely **client-side at runtime** via
`/api/comments` — the static shell never touches Prisma at build time.

- **Comments:** sign-in required to post, new comments default to `PENDING`
- **Moderation** (`/admin/comments`): Approve/Reject/Delete, pending-first
- **Users** (`/admin/users`): Promote/Demote, Block/Unblock — an admin can
  never modify their own account (shows "This is you" instead of buttons)
- **Newsletter:** homepage signup now wired to a real server action;
  `/admin/newsletter` adds subscriber management + a CSV export route

**Bugs fixed:** `Badge` had no `destructive` variant (needed for
Rejected/Blocked states); the Phase 6 pre-generation `.map()` typing quirk
recurred in the new routes, fixed the same way.

**Checklist**
- [x] 39/39 routes; `/blog/[slug]` still SSG
- [x] `POST /api/comments` rejects unauthenticated requests before touching the DB
- [x] New comments always start `PENDING`
- [x] Admins cannot touch their own account
- [ ] Exercising against real data — **needs the live database**

</details>

<details>
<summary><b>Phase 8 — SEO Panel & Site Settings</b> ✅</summary>

<br/>

`sitemap.xml`, `robots.txt`, Open Graph/Twitter defaults, and a real
`/admin/settings` screen backed by a new `SiteSettings` singleton model.

**Scope note:** the settings form genuinely reads/writes the database — not
a placeholder. What's *not* wired yet is the public site consuming those
settings live, since that would force static pages into dynamic rendering
for something not strictly needed yet. Explicit follow-up, not a limitation.

- `getSiteSettings()` upserts-on-read so the form always has a row
- Tabbed settings form (General / SEO / Social)
- `app/sitemap.ts` built from `constants/blog-posts.ts` — not a live query
- `app/opengraph-image.tsx` — branded default OG image via `next/og`

**Checklist**
- [x] 42/42 routes; sitemap/robots/OG image all statically generated
- [x] Settings form validates URLs/emails with `zod`
- [x] `/admin/settings` independently re-checks `requireAdmin()`
- [ ] Public pages reading these settings — **explicit follow-up work**

</details>

<details>
<summary><b>Phase 9 — AI Motivation Coach</b> ✅</summary>

<br/>

A streaming chat page backed by **Groq** (llama-3.3-70b-versatile), gated
behind sign-in, with a system prompt grounded in the site's own voice.

- `/api/ai/chat` — requires sign-in, validates with `zod` (capped at 20
  messages / 4000 chars each), streams the reply as `text/plain`
- `components/ai/coach-chat.tsx` — token-by-token streaming UI via
  `ReadableStreamDefaultReader`, sign-in gate when signed out
- Model configurable via `GROQ_MODEL` — a one-line env change, not a code change

**Why Groq instead of Anthropic:** switched off the Claude API to stay on a
free tier. Groq is OpenAI-compatible, so the system prompt is just the
first `role: "system"` message and streaming is a plain `for await` loop —
verified against the real `groq-sdk` types rather than assumed.

> ⚠️ No `GROQ_API_KEY` configured here and Groq's domain isn't in this
> sandbox's network allowlist, so a live conversation hasn't been
> exercised yet — smoke-test once your key is set (free at console.groq.com).

**Checklist**
- [x] 44/44 routes; `/ai-coach` static, `/api/ai/chat` correctly dynamic
- [x] Rejects unauthenticated (401) and oversized/malformed (400) requests
      before ever calling Groq
- [x] Conversation and per-message length both capped
- [x] Explicit crisis-response instruction in the system prompt (redirect
      to 988 / local emergency services, drop the coaching tone)
- [ ] An actual streamed conversation — **needs `GROQ_API_KEY`**

</details>

---

## 🔒 Security Note

Next.js and React had a series of critical RSC advisories in Dec 2025
(CVE-2025-55182 / CVE-2025-66478) and follow-ups (CVE-2025-55183 /
CVE-2025-55184 / CVE-2025-67779). This project is pinned to `next@15.5.18`
and `react@19.2.1`/`react-dom@19.2.1`, patched against all of the above as
of this writing. Before deploying, run `npm outdated` and check
[nextjs.org/blog](https://nextjs.org/blog) for newer advisories.

---

## 🧭 What's Next

Say **"Next Phase"** to keep building. Remaining from the original spec:
**Search**, **Testimonials management**, and future-monetization groundwork
(AdSense / affiliate / membership placeholders) — or say what you'd like
prioritized instead.

<div align="center">

<br/>

**[🌐 Visit the Live Site →](https://motivationalweapons.vercel.app/)**

</div>
