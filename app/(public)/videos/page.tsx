import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCard } from "@/components/video/video-card";
import { VIDEOS } from "@/constants/videos";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch Motivational Weapons videos — YouTube, Facebook Reels, and Shorts, all in one place.",
};

function VideoGrid({
  platform,
}: {
  platform?: "YouTube" | "Facebook" | "Shorts";
}) {
  const videos = platform
    ? VIDEOS.filter((video) => video.platform === platform)
    : VIDEOS;

  if (videos.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No videos in this category yet — check back soon.
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

export default function VideosPage() {
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
            <VideoGrid />
          </TabsContent>
          <TabsContent value="youtube" className="w-full">
            <VideoGrid platform="YouTube" />
          </TabsContent>
          <TabsContent value="facebook" className="w-full">
            <VideoGrid platform="Facebook" />
          </TabsContent>
          <TabsContent value="shorts" className="w-full">
            <VideoGrid platform="Shorts" />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
