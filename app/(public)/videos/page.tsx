import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCard } from "@/components/video/video-card";
import { prisma } from "@/lib/prisma";
import type { Video } from "@/types";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch Motivational Weapons videos — YouTube, Facebook Reels, and Shorts, all in one place.",
};

export const dynamic = "force-dynamic";

function VideoGrid({
  videos,
  platform,
}: {
  videos: Video[];
  platform?: "YouTube" | "Facebook" | "Shorts";
}) {
  const filteredVideos = platform
    ? videos.filter((video) => video.platform === platform)
    : videos;

  if (filteredVideos.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No videos in this category yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  const mappedVideos: Video[] = videos.map((video) => ({
    id: video.id,
    title: video.title,
    platform:
      video.platform === "YOUTUBE"
        ? "YouTube"
        : video.platform === "FACEBOOK"
          ? "Facebook"
          : "Shorts",
    duration:
      video.durationSeconds != null
        ? `${Math.floor(video.durationSeconds / 60)}:${String(
            video.durationSeconds % 60
          ).padStart(2, "0")}`
        : "Watch",
    thumbnail: video.thumbnailUrl ?? "",
    url: video.url,
    featured: video.featured,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Watch. Absorb. Repeat."
        title={
          <>
            VIDEOS BUILT TO <span className="text-primary">MOVE YOU</span>
          </>
        }
        description="Short clips for a quick reset, longer videos for when you need to reload completely."
      />
      <section className="container pb-24">
        <Tabs defaultValue="all" className="flex flex-col items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="facebook">Facebook Reels</TabsTrigger>
            <TabsTrigger value="shorts">Shorts</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="w-full">
            <VideoGrid videos={mappedVideos} />
          </TabsContent>
          <TabsContent value="youtube" className="w-full">
            <VideoGrid videos={mappedVideos} platform="YouTube" />
          </TabsContent>
          <TabsContent value="facebook" className="w-full">
            <VideoGrid videos={mappedVideos} platform="Facebook" />
          </TabsContent>
          <TabsContent value="shorts" className="w-full">
            <VideoGrid videos={mappedVideos} platform="Shorts" />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
