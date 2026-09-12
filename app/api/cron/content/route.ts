import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createDailyBlogPost, syncLatestYouTubeVideos } from "@/lib/content-automation";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [videos, post] = await Promise.all([syncLatestYouTubeVideos(), createDailyBlogPost()]);
    revalidatePath("/");
    revalidatePath("/videos");
    revalidatePath("/blog");
    return NextResponse.json({ ok: true, videos, post: post.slug });
  } catch (error) {
    console.error("Daily content automation failed", error);
    return NextResponse.json({ error: "Content automation failed" }, { status: 500 });
  }
}