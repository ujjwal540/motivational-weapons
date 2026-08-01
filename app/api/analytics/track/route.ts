import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function detectDevice(userAgent: string | null): string | null {
  if (!userAgent) return null;
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

export async function POST(request: NextRequest) {
  const { path, referrer } = (await request.json()) as {
    path?: string;
    referrer?: string;
  };

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        device: detectDevice(request.headers.get("user-agent")),
      },
    });
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    // Analytics is best-effort — a failed write here should never surface
    // as a visible error to a real visitor.
    console.error("Failed to record page view:", error);
    return NextResponse.json({ status: "ignored" });
  }
}
