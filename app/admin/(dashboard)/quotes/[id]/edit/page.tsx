import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { QuoteForm } from "../../quote-form";
import { updateQuote } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Quote",
  robots: { index: false, follow: false },
};

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [quote, categories] = await Promise.all([
    prisma.quote.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!quote) {
    notFound();
  }

  const boundUpdateQuote = updateQuote.bind(null, quote.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          EDIT <span className="text-primary">QUOTE</span>
        </h1>
      </div>
      <QuoteForm
        action={boundUpdateQuote}
        categories={categories}
        defaultValues={{
          text: quote.text,
          author: quote.author,
          categoryId: quote.categoryId,
          isDaily: quote.isDaily,
        }}
      />
    </div>
  );
}
