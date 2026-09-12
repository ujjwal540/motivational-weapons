# Post-Deploy Checklist

Use this after the Vercel deployment is live.

## Verify core paths

1. Open the homepage and confirm the public site loads.
2. Open `/admin/login` and confirm login works.
3. Open `/admin/profile` and confirm the password form renders.
4. Open `/admin/dashboard` and confirm the dashboard loads after sign-in.

## Verify data wiring

1. Check that Supabase tables exist after Prisma migration.
2. Confirm seeded content appears on the public pages.
3. Confirm admin dashboard counts match the seeded rows.

## Verify environment setup

1. Confirm `NEXT_PUBLIC_USE_FAKE_AUTH` is not set in production.
2. Confirm the Vercel `DATABASE_URL` points to the pooled Supabase URL.
3. Confirm the Vercel `DIRECT_URL` points to the direct Supabase URL.
4. Confirm Firebase admin credentials are present.

## Optional follow-up work

- Add a custom domain in Vercel.
- Replace demo content with real content.
- Connect Cloudinary uploads if you plan to host media.
- Tighten analytics or monitoring if you want production observability.