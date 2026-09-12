import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentsSection } from "@/components/blog/comments-section";

export async function generateStaticParams() {
  const posts: Array<{ slug: string }> = await prisma.blogPost.findMany({
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, author: true },
  });
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
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, author: true },
  });

  if (!post) {
    notFound();
  }

  const date = new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
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

      <Badge variant="ember">{post.category?.name ?? "Uncategorized"}</Badge>
      <h1 className="mt-4 font-display text-3xl leading-tight tracking-wide sm:text-5xl">
        {post.title}
      </h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author?.name ?? post.author?.email ?? "Motivational Weapons"}</span>
        <span aria-hidden>&bull;</span>
        <span>{date}</span>
        <span aria-hidden>&bull;</span>
        <span>{post.readTimeMinutes ? `${post.readTimeMinutes} min read` : "5 min read"}</span>
      </div>

      <div className="ember-line my-8" />

      <div className="flex flex-col gap-5 text-foreground/90">
        <p className="text-lg leading-relaxed">{post.excerpt}</p>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={630}
            className="rounded-xl border border-border"
            priority
          />
        ) : null}
        {post.content.split(/\r?\n+/).filter(Boolean).map((paragraph, index) => (
          <p key={`${post.id}-paragraph-${index}`} className="leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      <CommentsSection slug={post.slug} />
    </article>
  );
}
