import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { VideoForm } from "../video-form";
import { createVideo } from "../actions";

export const metadata: Metadata = {
  title: "New Video",
  robots: { index: false, follow: false },
};

export default async function NewVideoPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          NEW <span className="text-primary">VIDEO</span>
        </h1>
      </div>
      <VideoForm action={createVideo} categories={categories} />
    </div>
  );
}
