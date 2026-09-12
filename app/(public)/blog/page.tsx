import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import { BlogCard } from "@/components/blog/blog-card";
import { prisma } from "@/lib/prisma";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on discipline, resilience, and mindset from Motivational Weapons.",
};

export default async function BlogPage() {
  const posts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string | null;
    category: { name: string } | null;
    author: { name: string | null; email: string } | null;
    publishedAt: Date | null;
    createdAt: Date;
    readTimeMinutes: number | null;
    featured: boolean;
  }> = await prisma.blogPost.findMany({
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
  });

  const mappedPosts: BlogPost[] = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage ?? undefined,
    category: post.category?.name ?? "Uncategorized",
    author: post.author?.name ?? post.author?.email ?? "Motivational Weapons",
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    readTime: post.readTimeMinutes ? `${post.readTimeMinutes} min read` : "5 min read",
    featured: post.featured,
  }));

  const featured = mappedPosts.find((post) => post.featured) ?? mappedPosts[0];
  const rest = mappedPosts.filter((post) => post.id !== featured?.id);

  return (
    <>
      <PageHeader
        eyebrow="Longer Reads"
        title={
          <>
            THE <span className="text-primary">BLOG</span>
          </>
        }
        description="Deeper dives on discipline, resilience, and mindset — for when a quote isn't enough."
      />
      <section className="container pb-24">
        {featured ? (
          <div className="mb-10">
            <BlogCard post={featured} className="sm:p-8" />
          </div>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
