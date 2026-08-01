import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import { BlogCard } from "@/components/blog/blog-card";
import { BLOG_POSTS } from "@/constants/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on discipline, resilience, and mindset from Motivational Weapons.",
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

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
