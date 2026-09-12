import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  createDailyBlogPost,
  publishScheduledQuote,
  syncLatestYouTubeVideos,
} from "@/lib/content-automation";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const edition = new URL(request.url).searchParams.get("edition") === "night"
    ? "night"
    : "morning";
  const results = edition === "night"
    ? await Promise.allSettled([publishScheduledQuote("night")])
    : await Promise.allSettled([
        publishScheduledQuote("morning"),
        syncLatestYouTubeVideos(),
        createDailyBlogPost(),
      ]);
  const [quoteResult, videoResult, postResult] = results;

  if (quoteResult.status === "rejected") {
    console.error(`${edition} quote publishing failed`, quoteResult.reason);
  }
  if (videoResult?.status === "rejected") {
    console.error("YouTube content sync failed", videoResult.reason);
  }
  if (postResult?.status === "rejected") {
    console.error("Daily blog generation failed", postResult.reason);
  }

  if (
    quoteResult.status === "rejected" &&
    (!videoResult || videoResult.status === "rejected") &&
    (!postResult || postResult.status === "rejected")
  ) {
    return NextResponse.json({ error: "Content automation failed" }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/daily-motivation");
  revalidatePath("/quotes");
  revalidatePath("/videos");
  revalidatePath("/blog");
  return NextResponse.json({
    ok: true,
    edition,
    quote: quoteResult.status === "fulfilled" ? quoteResult.value.id : null,
    videos: videoResult?.status === "fulfilled" ? videoResult.value : null,
    post: postResult?.status === "fulfilled" ? postResult.value.slug : null,
    warnings: [
      ...(quoteResult.status === "rejected" ? ["Daily quote publishing failed."] : []),
      ...(videoResult?.status === "rejected" ? ["YouTube video sync failed."] : []),
      ...(postResult?.status === "rejected" ? ["Daily blog generation failed."] : []),
    ],
  });
}