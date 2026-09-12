"use client";

import * as React from "react";

import { QuoteCard } from "@/components/quote/quote-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Quote } from "@/types";

export function QuotesGrid({ quotes }: { quotes: Quote[] }) {
  const quoteCategories = React.useMemo(() => {
    const categories = Array.from(new Set(quotes.map((quote) => quote.category)));
    return ["All", ...categories] as const;
  }, [quotes]);

  const [active, setActive] = React.useState<(typeof quoteCategories)[number]>("All");

  const filtered =
    active === "All" ? quotes : quotes.filter((q) => q.category === active);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {quoteCategories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={category === active ? "ember" : "outline"}
            onClick={() => setActive(category)}
            className={cn(category === active && "shadow")}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">
          No quotes in this category yet — check back soon.
        </p>
      ) : null}
    </>
  );
}
