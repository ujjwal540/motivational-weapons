import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommentActions } from "./comment-actions-row";

export const metadata: Metadata = {
  title: "Comments",
  robots: { index: false, follow: false },
};

interface CommentRow {
  id: string;
  content: string;
  status: string;
  createdAt: Date;
  author: { name: string | null; email: string };
  post: { title: string; slug: string };
}

const STATUS_VARIANT: Record<string, "ember" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "ember",
  REJECTED: "destructive",
};

export default async function AdminCommentsPage() {
  const comments: CommentRow[] = await prisma.comment.findMany({
    include: {
      author: { select: { name: true, email: true } },
      post: { select: { title: true, slug: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          COMMENTS <span className="text-primary">({comments.length})</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New comments start as Pending and won&rsquo;t appear on the site until
          approved.
        </p>
      </div>

      {comments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No comments yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className="max-w-sm">
                  <p className="line-clamp-2 text-sm">{comment.content}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {comment.author.name ?? comment.author.email}
                </TableCell>
                <TableCell className="max-w-[12rem] text-sm text-muted-foreground">
                  <p className="line-clamp-1">{comment.post.title}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[comment.status]}>
                    {comment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <CommentActions id={comment.id} status={comment.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
