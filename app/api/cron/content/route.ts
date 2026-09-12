import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createDailyBlogPost, syncLatestYouTubeVideos } from "@/lib/content-automation";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [videoResult, postResult] = await Promise.allSettled([
    syncLatestYouTubeVideos(),
    createDailyBlogPost(),
  ]);

  if (videoResult.status === "rejected") {
    console.error("YouTube content sync failed", videoResult.reason);
  }
  if (postResult.status === "rejected") {
    console.error("Daily blog generation failed", postResult.reason);
  }

  if (videoResult.status === "rejected" && postResult.status === "rejected") {
    return NextResponse.json({ error: "Content automation failed" }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/videos");
  revalidatePath("/blog");
  return NextResponse.json({
    ok: true,
    videos: videoResult.status === "fulfilled" ? videoResult.value : null,
    post: postResult.status === "fulfilled" ? postResult.value.slug : null,
    warnings: postResult.status === "rejected" ? ["Daily blog generation failed."] : [],
  });
}