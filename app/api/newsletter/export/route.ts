import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  // API routes aren't covered by the admin layout's requireAdmin() check
  // (that only guards page rendering), so every admin API route re-checks
  // it independently — same rule as the Server Actions.
  await requireAdmin();

  const subscribers: Array<{
    email: string;
    active: boolean;
    subscribedAt: Date;
    unsubscribedAt: Date | null;
  }> = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const header = "email,active,subscribed_at,unsubscribed_at";
  const rows = subscribers.map((subscriber) =>
    [
      csvEscape(subscriber.email),
      subscriber.active ? "true" : "false",
      subscriber.subscribedAt.toISOString(),
      subscriber.unsubscribedAt?.toISOString() ?? "",
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
