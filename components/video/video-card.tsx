import { Facebook, Play, Youtube, Zap } from "lucide-react";
import Image from "next/image";

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
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
    >
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-secondary to-accent/40">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={320}
            height={180}
            className="absolute inset-0 h-full w-full object-cover brightness-90 transition duration-500 group-hover:scale-105 group-hover:brightness-105"
          />
        ) : null}
        <div className="ember-line absolute inset-x-0 top-0" />
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Play className="h-5 w-5 translate-x-0.5 fill-current" />
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium text-foreground">
          {video.duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          <PlatformIcon className="h-3.5 w-3.5" />
          {video.platform}
        </span>
        <h3 className="font-display text-lg leading-snug tracking-wide text-foreground">
          {video.title}
        </h3>
      </div>
    </a>
  );
}
