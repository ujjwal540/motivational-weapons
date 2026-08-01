import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "container flex flex-col items-center gap-5 py-16 text-center sm:py-20",
        className
      )}
    >
      {eyebrow ? (
        <Badge variant="ember" className="tracking-wide">
          {eyebrow}
        </Badge>
      ) : null}
      <h1 className="max-w-2xl font-display text-4xl leading-tight tracking-wide sm:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-xl text-muted-foreground">{description}</p>
      ) : null}
      {children}
      <div className="ember-line max-w-xs" />
    </section>
  );
}
