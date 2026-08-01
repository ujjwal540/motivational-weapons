import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * Comments are looked up by the blog post's `slug` rather than its
 * database `id` everywhere in this file. That keeps the statically
 * generated `/blog/[slug]` page (built from `constants/blog-posts.ts`,
 * pre-rendered at build time) completely free of any database dependency —
 * only this route, which only ever runs at request time, needs to resolve
 * slug → real BlogPost row.
 */

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const post = await prisma.blogPost.findUnique({ where: { slug } });

  // No matching post in the database yet (e.g. seed hasn't run) — that's
  // not an error from the visitor's point of view, just "no comments yet".
  if (!post) {
    return NextResponse.json({ comments: [] });
  }

  const comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: { name: string | null; image: string | null };
  }> = await prisma.comment.findMany({
    where: { postId: post.id, status: "APPROVED" },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    comments: comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      authorName: comment.author.name ?? "Anonymous",
      authorImage: comment.author.image,
    })),
  });
}

const submitCommentSchema = z.object({
  slug: z.string().min(1),
  content: z.string().min(3, "Comment is too short.").max(2000),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to comment." }, { status: 401 });
  }

  const parsed = submitCommentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid comment." },
      { status: 400 }
    );
  }

  const post = await prisma.blogPost.findUnique({
    where: { slug: parsed.data.slug },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId: post.id,
      authorId: user.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({
    status: "pending",
    message:
      "Thanks — your comment is awaiting approval and will appear once it's reviewed.",
  });
}
