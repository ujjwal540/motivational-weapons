# Deployment Guide

## Recommended stack

- GitHub for source control
- Vercel for the Next.js app, admin dashboard, and API routes
- Supabase Postgres for the database
- Firebase Auth for admin login

This repository is a single Next.js application, so keeping frontend and backend
together on Vercel is the simplest and most stable option. I do not recommend
splitting the backend to Render unless you later extract a separate service on
purpose.

## Why this is the best fit

- The app already uses Next.js route handlers and server actions.
- Vercel deploys Next.js without extra infrastructure.
- Supabase handles the database cleanly.
- Firebase Auth already matches the current auth flow.
- Docker is optional, not required for hosting this app.

## Steps to deploy

1. Create a GitHub repository and push this project to it.
2. Import the repo into Vercel.
3. Set the environment variables from `.env.example` in Vercel.
4. Use your Supabase project URL in the database connection strings.
  - Your project URL is the stable base URL and does **not** expire.
  - Only the keys/tokens can rotate or be regenerated.
5. Point `DATABASE_URL` to the pooled Supabase connection, for example:

  ```text
  postgresql://postgres:<PASSWORD>@nopnqmeqxsewnpvruqrv.supabase.co:6543/postgres?pgbouncer=true
  ```

6. Point `DIRECT_URL` to the direct Supabase connection, for example:

  ```text
  postgresql://postgres:<PASSWORD>@nopnqmeqxsewnpvruqrv.supabase.co:5432/postgres
  ```

7. Add Firebase client settings and Firebase Admin service-account values.
8. Leave `NEXT_PUBLIC_USE_FAKE_AUTH` unset in production.
9. Run the Prisma migration/seed steps against Supabase before going live.

## Recommended production env vars

Add these in Vercel, then copy the same values into your local `.env.local`
without committing secrets:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `GROQ_API_KEY`
- `GROQ_MODEL`

## Notes

- Use Docker only if you want a local Supabase/Postgres stack or a later Render
  service.
- If you keep all backend logic inside this app, you do not need Render.
- If you later split out a separate API, then Render becomes a reasonable
  second choice.