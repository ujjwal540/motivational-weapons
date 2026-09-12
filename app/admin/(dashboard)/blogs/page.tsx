import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { deletePost } from "./actions";

export const metadata: Metadata = {
  title: "Blog Posts",
  robots: { index: false, follow: false },
};

interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  coverImage: string | null;
  category: { id: string; name: string } | null;
}

export default async function AdminBlogsPage() {
  const posts: PostRow[] = await prisma.blogPost.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide">
            BLOG POSTS <span className="text-primary">({posts.length})</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything shown on /blog.
          </p>
        </div>
        <Button variant="ember" asChild>
          <Link href="/admin/blogs/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No posts yet.{" "}
          <Link href="/admin/blogs/new" className="text-primary underline">
            Write the first one
          </Link>
          .
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-sm">
                  <p className="line-clamp-1 text-sm font-medium">
                    {post.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /blog/{post.slug}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === "PUBLISHED" ? "ember" : "secondary"
                    }
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {post.category ? (
                    <Badge variant="secondary">{post.category.name}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {post.featured ? (
                    <Badge variant="ember">Featured</Badge>
                  ) : null}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/blogs/${post.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteButton
                      action={deletePost.bind(null, post.id)}
                      confirmMessage="Delete this post? This can't be undone."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
