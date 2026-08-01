// Deliberately has zero other imports. `middleware.ts` runs on the Edge
// runtime and can't load `firebase-admin` or Prisma (both Node-only), but it
// still needs this constant — so it lives here instead of inside
// `lib/auth.ts`, which pulls in both of those.
export const SESSION_COOKIE_NAME = "__session";
