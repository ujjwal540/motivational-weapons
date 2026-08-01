import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm",
        className
      )}
    >
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{testimonial.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-foreground">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
