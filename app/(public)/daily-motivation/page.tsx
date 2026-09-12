import type { Metadata } from "next";
import { Flame } from "lucide-react";

import { PageHeader } from "@/components/hero/page-header";
import { QuoteCard } from "@/components/quote/quote-card";
import { DailyQuotePanel } from "@/components/quote/daily-quote-panel";
import { prisma } from "@/lib/prisma";
import type { Quote } from "@/types";

export const metadata: Metadata = {
  title: "Daily Motivation",
  description:
    "Your daily dose of power — a new motivational weapon delivered every day.",
};

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default async function DailyMotivationPage() {
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

  const todayIndex = (new Date().getDay() + 6) % 7;
  const weekQuotes = mappedQuotes.slice(0, 7);
  const todaysQuote = mappedQuotes[0] ?? {
    id: "quote-fallback",
    text: "The struggle you are in today is developing the strength you need for tomorrow.",
    author: "Motivational Weapons",
    category: "Resilience",
  };

  return (
    <>
      <PageHeader
        eyebrow="Forged Fresh, Every Morning"
        title={
          <>
            YOUR <span className="text-primary">DAILY MOTIVATION</span>
          </>
        }
        description="One sharp quote, every single day. Come back each morning to reload."
      />

      <DailyQuotePanel initialQuote={todaysQuote} quotes={mappedQuotes} />

      <section className="container pb-24">
        <div className="mb-8 flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl tracking-wide">
            THIS WEEK&rsquo;S <span className="text-primary">ARSENAL</span>
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          {weekQuotes.map((quote, index) => (
            <div
              key={quote.id}
              className={
                index === todayIndex
                  ? "rounded-lg ring-2 ring-primary"
                  : "rounded-lg"
              }
            >
              <div className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {WEEK_LABELS[index]}
                {index === todayIndex ? (
                  <span className="ml-1.5 text-primary">&bull; Today</span>
                ) : null}
              </div>
              <QuoteCard quote={quote} className="h-full text-sm" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
