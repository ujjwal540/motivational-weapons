import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { PostForm } from "../post-form";
import { createPost } from "../actions";

export const metadata: Metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          NEW <span className="text-primary">POST</span>
        </h1>
      </div>
      <PostForm action={createPost} categories={categories} />
    </div>
  );
}
