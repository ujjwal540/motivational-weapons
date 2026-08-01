import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BLOG_POSTS } from "@/constants/blog-posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentsSection } from "@/components/blog/comments-section";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="container max-w-2xl py-16">
      <Button variant="ghost" size="sm" asChild className="-ml-3 mb-8">
        <Link href="/blog">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <Badge variant="ember">{post.category}</Badge>
      <h1 className="mt-4 font-display text-3xl leading-tight tracking-wide sm:text-5xl">
        {post.title}
      </h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author}</span>
        <span aria-hidden>&bull;</span>
        <span>{date}</span>
        <span aria-hidden>&bull;</span>
        <span>{post.readTime}</span>
      </div>

      <div className="ember-line my-8" />

      <div className="flex flex-col gap-5 text-foreground/90">
        <p className="text-lg leading-relaxed">{post.excerpt}</p>
        <p className="leading-relaxed text-muted-foreground">
          The full article is being forged — this placeholder confirms the
          layout, routing, and metadata for every post are wired correctly. Once
          the content layer lands in a later phase, this space will hold the
          complete, rich-text article body straight from the admin dashboard.
        </p>
      </div>

      <CommentsSection slug={post.slug} />
    </article>
  );
}
