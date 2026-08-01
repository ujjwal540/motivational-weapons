import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { QuoteForm } from "../quote-form";
import { createQuote } from "../actions";

export const metadata: Metadata = {
  title: "New Quote",
  robots: { index: false, follow: false },
};

export default async function NewQuotePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          NEW <span className="text-primary">QUOTE</span>
        </h1>
      </div>
      <QuoteForm action={createQuote} categories={categories} />
    </div>
  );
}
