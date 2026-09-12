import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import { QuotesGrid } from "@/components/quote/quotes-grid";
import { prisma } from "@/lib/prisma";
import type { Quote } from "@/types";

export const metadata: Metadata = {
  title: "Quotes",
  description:
    "Browse every Motivational Weapons quote by category — discipline, resilience, success, focus, and self-belief.",
};

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const mappedQuotes: Quote[] = quotes.map((quote) => ({
    id: quote.id,
    text: quote.text,
    author: quote.author,
    category: quote.category?.name ?? "Uncategorized",
  }));

  return (
    <>
      <PageHeader
        eyebrow="The Full Arsenal"
        title={
          <>
            QUOTES THAT <span className="text-primary">CUT DEEP</span>
          </>
        }
        description="Filter by what you need today — discipline, resilience, focus, or a straight shot of self-belief."
      />
      <section className="container pb-24">
        <QuotesGrid quotes={mappedQuotes} />
      </section>
    </>
  );
}
