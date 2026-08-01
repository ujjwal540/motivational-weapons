"use client";

import * as React from "react";
import { RefreshCcw, Share2, Check } from "lucide-react";

import { QuoteCard } from "@/components/quote/quote-card";
import { Button } from "@/components/ui/button";
import { QUOTES } from "@/constants/quotes";
import type { Quote } from "@/types";

export function DailyQuotePanel({ initialQuote }: { initialQuote: Quote }) {
  const [quote, setQuote] = React.useState(initialQuote);
  const [copied, setCopied] = React.useState(false);

  function nextQuote() {
    const others = QUOTES.filter((q) => q.id !== quote.id);
    const random = others[Math.floor(Math.random() * others.length)];
    setQuote(random ?? quote);
  }

  async function shareQuote() {
    const text = `"${quote.text}" — ${quote.author}`;
    try {
      if (navigator.share) {
        await navigator.share({ text, title: "Motivational Weapons" });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // User cancelled the share sheet or clipboard is unavailable — no-op.
    }
  }

  return (
    <section className="container flex flex-col items-center gap-6 pb-16">
      <div className="w-full max-w-xl">
        <QuoteCard quote={quote} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="ember" onClick={nextQuote}>
          <RefreshCcw className="h-4 w-4" />
          New Quote
        </Button>
        <Button variant="outline" onClick={shareQuote}>
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Share"}
        </Button>
      </div>
    </section>
  );
}
