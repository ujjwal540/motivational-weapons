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

## Supabase connection strings

Use your project host directly. The project URL does not expire; only tokens
and passwords can be rotated.

```text
DATABASE_URL=postgresql://postgres:<PASSWORD>@nopnqmeqxsewnpvruqrv.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:<PASSWORD>@nopnqmeqxsewnpvruqrv.supabase.co:5432/postgres
```

## Minimum production steps

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add the variables above.
4. Run Prisma migrations against Supabase.
5. Seed the database if you want the starter content.
6. Deploy.

## Local development

- Keep `.env.local` on your machine only.
- Leave demo auth off for production.
- Never commit your private Firebase key or Supabase password.