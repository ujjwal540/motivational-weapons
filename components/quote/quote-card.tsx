import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Quote } from "@/types";

export function QuoteCard({
  quote,
  className,
}: {
  quote: Quote;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50",
        className
      )}
    >
      <Flame className="h-5 w-5 text-primary/70 transition-colors group-hover:text-primary" />
      <blockquote className="flex-1 text-lg leading-snug tracking-wide text-foreground">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <figcaption className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{quote.author}</span>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {quote.category}
        </span>
      </figcaption>
    </figure>
  );
}
