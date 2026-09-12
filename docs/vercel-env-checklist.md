# Vercel Environment Checklist

Use this when you import the GitHub repo into Vercel.

## Public variables

These are safe to expose in the client bundle:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_USE_FAKE_AUTH` should stay unset in production

## Secret variables

These must stay server-side in Vercel:

- `DATABASE_URL`
- `DIRECT_URL`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `YOUTUBE_API_KEY`
- `CRON_SECRET`

## Supabase connection strings

Use your project host directly. The project URL does not expire; only tokens
and passwords can be rotated.

```text
DATABASE_URL=postgresql://postgres:<PASSWORD>@nopnqmeqxsewnpvruqrv.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:<PASSWORD>@nopnqmeqxsewnpvruqrv.supabase.co:5432/postgres
```

## Minimum production steps

1. Push the repo to GitHub.
2. In Vercel Settings -> Git, set the Production Branch to `main`.
3. Import it into Vercel or redeploy the latest `main` deployment.
4. Add the variables above in the Production environment.
	`DATABASE_URL` must be added before runtime; Prisma Client generation can
	complete during the build without it, but database-backed pages will not
	work until the real Supabase URL is configured.
5. Run Prisma migrations against Supabase.
6. Seed the database if you want the starter content.
7. Deploy.

## What to put where

- `NEXT_PUBLIC_SITE_URL`: your Vercel domain, such as `https://your-app.vercel.app`
- `DATABASE_URL`: Supabase pooled connection on port `6543`
- `DIRECT_URL`: Supabase direct connection on port `5432`
- `NEXT_PUBLIC_*` Firebase values: from Firebase web app config
- `FIREBASE_*` values: from the Firebase service account JSON
- `CLOUDINARY_*`: from your Cloudinary dashboard, if you use uploads
- `GROQ_API_KEY`: from Groq, if you use the AI coach
- `YOUTUBE_API_KEY`: from Google Cloud with YouTube Data API v3 enabled
- `CRON_SECRET`: a random secret used by the scheduled content route

Do not commit `CRON_SECRET` to GitHub. Add the same secret value to Vercel's
Production Environment Variables. Vercel Cron sends it as
`Authorization: Bearer <CRON_SECRET>` when it calls `/api/cron/content`.

Vercel Cron runs two automatic content jobs: `06:00 UTC` publishes the morning
quote, syncs the latest six uploads from `@MotivationalWeapons`, features the
newest YouTube video, and publishes one original Groq-generated blog post with
a branded generated cover image. `21:00 UTC` publishes a separate good-night
quote. Change the schedules in `vercel.json` if your preferred fixed times are
different.

## Local development

- Keep `.env.local` on your machine only.
- Leave demo auth off for production.
- Never commit your private Firebase key or Supabase password.