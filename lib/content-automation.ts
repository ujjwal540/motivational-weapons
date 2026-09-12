import "server-only";

import { PostStatus, Role, VideoPlatform } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { generateDailyArticle } from "@/lib/ai-coach";
import { QUOTES } from "@/constants/quotes";
import { slugify } from "@/lib/utils";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const CHANNEL_HANDLE = "@MotivationalWeapons";
const MOTIVATION_TERMS = [
  "motivat",
  "discipline",
  "mindset",
  "success",
  "focus",
  "habit",
  "confidence",
  "resilien",
  "strength",
  "growth",
  "goal",
  "life",
  "self",
  "power",
  "overcome",
  "consisten",
  "build",
  "quit",
  "pain",
  "struggle",
] as const;

function isMotivationalVideo(title: string) {
  const normalizedTitle = title.toLowerCase();
  return MOTIVATION_TERMS.some((term) => normalizedTitle.includes(term));
}

function parseDuration(value: string) {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

async function youtubeRequest<T>(resource: string, params: Record<string, string>) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not configured.");
  const searchParams = new URLSearchParams({ ...params, key });
  const response = await fetch(`${YOUTUBE_API_BASE}/${resource}?${searchParams}`, {
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`YouTube API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function syncLatestYouTubeVideos() {
  const channel = await youtubeRequest<{
    items?: Array<{ contentDetails: { relatedPlaylists: { uploads: string } } }>;
  }>("channels", { part: "id,contentDetails", forHandle: CHANNEL_HANDLE });
  const uploadsPlaylist = channel.items?.[0]?.contentDetails.relatedPlaylists.uploads;
  if (!uploadsPlaylist) throw new Error("YouTube channel was not found.");

  const playlist = await youtubeRequest<{
    items?: Array<{
      snippet: { title: string; publishedAt: string; thumbnails?: { high?: { url: string } } };
      contentDetails: { videoId: string };
    }>;
  }>("playlistItems", { part: "snippet,contentDetails", playlistId: uploadsPlaylist, maxResults: "6" });
  const motivationalItems = (playlist.items ?? []).filter((item) =>
    isMotivationalVideo(item.snippet.title)
  );
  const videoIds = motivationalItems.map((item) => item.contentDetails.videoId);
  if (videoIds.length === 0) return 0;

  const details = await youtubeRequest<{ items?: Array<{ id: string; contentDetails: { duration: string } }> }>(
    "videos",
    { part: "contentDetails", id: videoIds.join(",") }
  );
  const durations = new Map(
    (details.items ?? []).map((item) => [item.id, parseDuration(item.contentDetails.duration)])
  );

  for (const item of motivationalItems) {
    const videoId = item.contentDetails.videoId;
    const durationSeconds = durations.get(videoId) ?? null;
    await prisma.video.upsert({
      where: { id: `youtube-${videoId}` },
      update: {
        title: item.snippet.title,
        platform: VideoPlatform.YOUTUBE,
        thumbnailUrl: item.snippet.thumbnails?.high?.url ?? null,
        durationSeconds,
        publishedAt: new Date(item.snippet.publishedAt),
      },
      create: {
        id: `youtube-${videoId}`,
        title: item.snippet.title,
        platform: VideoPlatform.YOUTUBE,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: item.snippet.thumbnails?.high?.url ?? null,
        durationSeconds,
        publishedAt: new Date(item.snippet.publishedAt),
      },
    });
  }

  const newest = videoIds[0];
  await prisma.video.updateMany({
    where: { platform: { in: [VideoPlatform.YOUTUBE, VideoPlatform.SHORTS] } },
    data: { featured: false },
  });
  await prisma.video.update({ where: { id: `youtube-${newest}` }, data: { featured: true } });
  return videoIds.length;
}

export async function publishDailyQuote() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const dayNumber = Math.floor(Date.now() / 86_400_000);
  const quote = QUOTES[dayNumber % QUOTES.length];
  const category = await prisma.category.upsert({
    where: { slug: slugify(quote.category) },
    update: {},
    create: { name: quote.category, slug: slugify(quote.category) },
  });

  await prisma.quote.updateMany({
    where: { isDaily: true },
    data: { isDaily: false },
  });

  return prisma.quote.upsert({
    where: { id: `daily-${dateKey}` },
    update: {
      text: quote.text,
      author: quote.author,
      categoryId: category.id,
      isDaily: true,
      publishedAt: new Date(),
    },
    create: {
      id: `daily-${dateKey}`,
      text: quote.text,
      author: quote.author,
      categoryId: category.id,
      isDaily: true,
      publishedAt: new Date(),
    },
  });
}

export async function createDailyBlogPost() {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const existing = await prisma.blogPost.findFirst({
    where: { createdAt: { gte: startOfDay }, slug: { startsWith: "daily-" } },
  });
  if (existing) return existing;

  const admin = await prisma.user.upsert({
    where: { email: "admin@motivationalweapons.com" },
    update: {},
    create: { email: "admin@motivationalweapons.com", name: "Motivational Weapons", role: Role.ADMIN },
  });
  const article = await generateDailyArticle("discipline when motivation disappears");
  const slug = `daily-${slugify(article.title)}-${Date.now()}`;
  const category = await prisma.category.upsert({
    where: { slug: slugify(article.category) },
    update: {},
    create: { name: article.category, slug: slugify(article.category) },
  });

  return prisma.blogPost.create({
    data: {
      slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      categoryId: category.id,
      authorId: admin.id,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      readTimeMinutes: 3,
      coverImage: `/api/content/og?title=${encodeURIComponent(article.title)}&slug=${encodeURIComponent(slug)}`,
    },
  });
}