import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function BlogCard({
  post,
  className,
}: {
  post: BlogPost;
  className?: string;
}) {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-colors hover:border-primary/50",
        className
      )}
    >
      {post.coverImage ? (
        <div className="aspect-video overflow-hidden bg-secondary">
          <img
            src={post.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
          {post.category}
        </span>
        <span>{post.readTime}</span>
      </div>
      <h3 className="font-display text-xl leading-snug tracking-wide text-foreground">
        {post.title}
      </h3>
      <p className="flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
      <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span>{date}</span>
        <span className="inline-flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
          Read
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      </div>
    </Link>
  );
}
