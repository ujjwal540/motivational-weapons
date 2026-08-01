import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { deleteQuote } from "./actions";

export const metadata: Metadata = {
  title: "Quotes",
  robots: { index: false, follow: false },
};

interface QuoteRow {
  id: string;
  text: string;
  author: string;
  isDaily: boolean;
  category: { id: string; name: string } | null;
}

export default async function AdminQuotesPage() {
  const quotes: QuoteRow[] = await prisma.quote.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide">
            QUOTES <span className="text-primary">({quotes.length})</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything shown on /quotes and /daily-motivation.
          </p>
        </div>
        <Button variant="ember" asChild>
          <Link href="/admin/quotes/new">
            <Plus className="h-4 w-4" />
            New Quote
          </Link>
        </Button>
      </div>

      {quotes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No quotes yet.{" "}
          <Link href="/admin/quotes/new" className="text-primary underline">
            Create the first one
          </Link>
          .
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Daily</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="max-w-sm">
                  <p className="line-clamp-2 text-sm">{quote.text}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {quote.author}
                </TableCell>
                <TableCell>
                  {quote.category ? (
                    <Badge variant="secondary">{quote.category.name}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {quote.isDaily ? <Badge variant="ember">Daily</Badge> : null}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/quotes/${quote.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteButton
                      action={deleteQuote.bind(null, quote.id)}
                      confirmMessage="Delete this quote? This can't be undone."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
