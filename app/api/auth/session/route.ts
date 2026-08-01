import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getAdminAuth } from "@/firebase/admin";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

const SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000;

function isDemoAuthEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    (process.env.NEXT_PUBLIC_USE_FAKE_AUTH === "true" ||
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY)
  );
}

export async function POST(request: NextRequest) {
  const { idToken } = (await request.json()) as { idToken?: string };

  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  if (isDemoAuthEnabled()) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, "demo-admin-session", {
      maxAge: SESSION_DURATION_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "ok", mode: "demo" });
  }

  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(idToken);

    const email =
      decoded.email ?? `${decoded.uid}@no-email.motivationalweapons.com`;

    const existingByUid = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (existingByUid) {
      await prisma.user.update({
        where: { id: existingByUid.id },
        data: {
          email,
          name: decoded.name ?? undefined,
          image: decoded.picture ?? undefined,
        },
      });
    } else {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingByEmail) {
        await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            firebaseUid: decoded.uid,
            name: decoded.name ?? existingByEmail.name,
            image: decoded.picture ?? existingByEmail.image,
          },
        });
      } else {
        await prisma.user.create({
          data: {
            firebaseUid: decoded.uid,
            email,
            name: decoded.name ?? null,
            image: decoded.picture ?? null,
          },
        });
      }
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_DURATION_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json(
      { error: "Could not verify credentials" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ status: "ok" });
}