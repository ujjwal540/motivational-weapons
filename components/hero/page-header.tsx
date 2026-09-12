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
        "container relative flex flex-col items-center gap-5 overflow-hidden py-16 text-center sm:py-24",
        className
      )}
    >
      {eyebrow ? (
        <Badge variant="ember" className="tracking-wide">
          {eyebrow}
        </Badge>
      ) : null}
      <h1 className="max-w-3xl font-display text-5xl leading-[0.95] tracking-wide sm:text-7xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
      ) : null}
      {children}
      <div className="ember-line max-w-xs" />
    </section>
  );
}
