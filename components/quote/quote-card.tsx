import { Copy, Flame, Quote as QuoteIcon, Share2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { Quote } from "@/types";

export function QuoteCard({
  quote,
  className,
}: {
  quote: Quote;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copyQuote() {
    await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function shareQuote() {
    const text = `"${quote.text}" - ${quote.author}`;
    if (navigator.share) {
      await navigator.share({ title: "Motivational Weapons", text });
    } else {
      await copyQuote();
    }
  }

  return (
    <figure
      className={cn(
        "group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/80 p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
    >
      <div className="absolute right-5 top-4 text-primary/10 transition-colors group-hover:text-primary/20"><QuoteIcon className="h-20 w-20" /></div>
      <div className="flex items-center justify-between"><Flame className="h-5 w-5 text-primary/70 transition-colors group-hover:text-primary" /><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Daily signal</span></div>
      <blockquote className="relative flex-1 text-xl leading-snug tracking-wide text-foreground sm:text-2xl">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <figcaption className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{quote.author}</span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {quote.category}
        </span>
      </figcaption>
      <div className="flex gap-2 border-t border-border/70 pt-4">
        <button type="button" onClick={copyQuote} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary" aria-label="Copy quote"><Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}</button>
        <button type="button" onClick={() => void shareQuote()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary" aria-label="Share quote"><Share2 className="h-3.5 w-3.5" /> Share</button>
      </div>
    </figure>
  );
}
