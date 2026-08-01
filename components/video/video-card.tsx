import { Facebook, Play, Youtube, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Video } from "@/types";

const PLATFORM_ICON = {
  YouTube: Youtube,
  Facebook: Facebook,
  Shorts: Zap,
} as const;

export function VideoCard({
  video,
  className,
}: {
  video: Video;
  className?: string;
}) {
  const PlatformIcon = PLATFORM_ICON[video.platform];

  return (
    <a
      href={video.url}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-colors hover:border-primary/50",
        className
      )}
    >
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-secondary to-accent/40">
        <div className="ember-line absolute inset-x-0 top-0" />
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform group-hover:scale-110">
          <Play className="h-5 w-5 translate-x-0.5 fill-current" />
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium text-foreground">
          {video.duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          <PlatformIcon className="h-3.5 w-3.5" />
          {video.platform}
        </span>
        <h3 className="font-display text-base leading-snug tracking-wide text-foreground">
          {video.title}
        </h3>
      </div>
    </a>
  );
}
