import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mw-ember" x1="8" y1="4" x2="32" y2="36">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      {/* blade */}
      <path d="M20 4 L23 20 L20 32 L17 20 Z" fill="url(#mw-ember)" />
      {/* cross-guard */}
      <rect
        x="11"
        y="21"
        width="18"
        height="2.6"
        rx="1.3"
        fill="url(#mw-ember)"
      />
      {/* grip */}
      <rect
        x="18.6"
        y="24"
        width="2.8"
        height="7"
        rx="1.2"
        fill="url(#mw-ember)"
      />
      {/* pommel */}
      <circle cx="20" cy="33.5" r="2" fill="url(#mw-ember)" />
      {/* flame tip */}
      <path
        d="M20 2c1.6 1.7 2.6 3 2.1 4.6-.3 1-1.1 1.2-1.1 2.1 0 .7.6 1 .6 1.7 0 .9-.8 1.4-1.6 1.4s-1.6-.5-1.6-1.4c0-.7.6-1 .6-1.7 0-.9-.8-1.1-1.1-2.1C17.4 5 18.4 3.7 20 2Z"
        fill="url(#mw-ember)"
      />
    </svg>
  );
}
