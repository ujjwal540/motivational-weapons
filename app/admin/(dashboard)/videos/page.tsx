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
import { deleteVideo } from "./actions";

export const metadata: Metadata = {
  title: "Videos",
  robots: { index: false, follow: false },
};

interface VideoRow {
  id: string;
  title: string;
  platform: string;
  featured: boolean;
  category: { id: string; name: string } | null;
}

export default async function AdminVideosPage() {
  const videos: VideoRow[] = await prisma.video.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide">
            VIDEOS <span className="text-primary">({videos.length})</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything shown on /videos.
          </p>
        </div>
        <Button variant="ember" asChild>
          <Link href="/admin/videos/new">
            <Plus className="h-4 w-4" />
            New Video
          </Link>
        </Button>
      </div>

      {videos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No videos yet.{" "}
          <Link href="/admin/videos/new" className="text-primary underline">
            Add the first one
          </Link>
          .
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="max-w-sm">
                  <p className="line-clamp-2 text-sm">{video.title}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{video.platform}</Badge>
                </TableCell>
                <TableCell>
                  {video.category ? (
                    <Badge variant="secondary">{video.category.name}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {video.featured ? (
                    <Badge variant="ember">Featured</Badge>
                  ) : null}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/videos/${video.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteButton
                      action={deleteVideo.bind(null, video.id)}
                      confirmMessage="Delete this video? This can't be undone."
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
