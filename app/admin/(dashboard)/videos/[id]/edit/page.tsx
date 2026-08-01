import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { VideoForm } from "../../video-form";
import { updateVideo } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Video",
  robots: { index: false, follow: false },
};

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [video, categories] = await Promise.all([
    prisma.video.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!video) {
    notFound();
  }

  const boundUpdateVideo = updateVideo.bind(null, video.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          EDIT <span className="text-primary">VIDEO</span>
        </h1>
      </div>
      <VideoForm
        action={boundUpdateVideo}
        categories={categories}
        defaultValues={{
          title: video.title,
          platform: video.platform,
          url: video.url,
          thumbnailUrl: video.thumbnailUrl,
          categoryId: video.categoryId,
          featured: video.featured,
        }}
      />
    </div>
  );
}
