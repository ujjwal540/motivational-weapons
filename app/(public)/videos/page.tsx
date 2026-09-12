import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import { VideoCard } from "@/components/video/video-card";
import { VIDEOS } from "@/constants/videos";
import { prisma } from "@/lib/prisma";
import type { Video } from "@/types";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch motivational videos from YouTube to build discipline, resilience, and focus.",
};

export const dynamic = "force-dynamic";

type VideoRecord = {
  id: string;
  title: string;
  platform: "YOUTUBE" | "FACEBOOK" | "SHORTS";
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  url: string;
  featured: boolean;
};

function VideoGrid({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        More videos are being forged. Browse the YouTube motivation library
        while new uploads are added.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

export default async function VideosPage() {
  const videos: VideoRecord[] = await prisma.video.findMany({
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  const mappedVideos: Video[] = (videos.length > 0 ? videos.map((video) => ({
    id: video.id,
    title: video.title,
    platform: "YouTube" as const,
    duration:
      video.durationSeconds != null
        ? `${Math.floor(video.durationSeconds / 60)}:${String(
            video.durationSeconds % 60
          ).padStart(2, "0")}`
        : "Watch",
    thumbnail: video.thumbnailUrl ?? "",
    url: video.url,
    featured: video.featured,
  })) : VIDEOS).filter((video) => video.platform === "YouTube");

  return (
    <>
      <PageHeader
        eyebrow="Watch. Absorb. Repeat."
        title={
          <>
            VIDEOS BUILT TO <span className="text-primary">MOVE YOU</span>
          </>
        }
        description="One focused library of motivational videos from YouTube. Watch, reset, and take the next step."
      />
      <section className="container pb-24">
        <VideoGrid videos={mappedVideos} />
      </section>
    </>
  );
}
