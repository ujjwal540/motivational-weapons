import type { Metadata } from "next";
import { Download } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubscriberActions } from "./subscriber-actions-row";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

interface SubscriberRow {
  id: string;
  email: string;
  active: boolean;
  subscribedAt: Date;
}

export default async function AdminNewsletterPage() {
  const subscribers: SubscriberRow[] =
    await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });

  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide">
            NEWSLETTER{" "}
            <span className="text-primary">({activeCount} active)</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everyone who subscribed from the homepage signup form.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/api/newsletter/export">
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </Button>
      </div>

      {subscribers.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No subscribers yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="text-sm font-medium">
                  {subscriber.email}
                </TableCell>
                <TableCell>
                  <Badge variant={subscriber.active ? "ember" : "secondary"}>
                    {subscriber.active ? "Active" : "Unsubscribed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {subscriber.subscribedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <SubscriberActions
                    id={subscriber.id}
                    active={subscriber.active}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
