import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { PostForm } from "../../post-form";
import { updatePost } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Post",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) {
    notFound();
  }

  const boundUpdatePost = updatePost.bind(null, post.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          EDIT <span className="text-primary">POST</span>
        </h1>
      </div>
      <PostForm
        action={boundUpdatePost}
        categories={categories}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          categoryId: post.categoryId,
          featured: post.featured,
        }}
      />
    </div>
  );
}
