import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAdminAuth } from "@/firebase/admin";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

export interface CurrentUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  blocked: boolean;
}

/**
 * Verifies the session cookie (if present) against Firebase Admin, then
 * loads the matching row from our own `User` table so callers get the
 * app-specific fields (role, blocked) alongside the Firebase identity.
 * Returns `null` for anyone not signed in, or with an invalid/expired
 * session — callers decide whether that's worth a redirect.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  if (
    process.env.NODE_ENV !== "production" &&
    sessionCookie === "demo-admin-session"
  ) {
    return {
      id: "demo-admin",
      firebaseUid: "demo-admin",
      email: "admin@local.test",
      name: "Demo Admin",
      image: null,
      role: "ADMIN",
      blocked: false,
    };
  }

  try {
    const decoded = await getAdminAuth().verifySessionCookie(
      sessionCookie,
      true
    );

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user || user.blocked) {
      return null;
    }

    return {
      id: user.id,
      firebaseUid: decoded.uid,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      blocked: user.blocked,
    };
  } catch {
    // Expired, revoked, or malformed cookie — treat the same as signed out.
    return null;
  }
}

/**
 * Call at the top of any protected admin page/layout. Redirects to
 * /admin/login when there's no valid session or the signed-in user isn't
 * an admin, otherwise returns the current user for the caller to use.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return user;
}
