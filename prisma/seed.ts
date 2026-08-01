/**
 * Seeds the database with the same content already shown on the static
 * Phase 3 pages, so switching those pages over to real data (Phase 5+)
 * doesn't change what visitors see.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient, Role, VideoPlatform, PostStatus } from "@prisma/client";

import { QUOTES } from "../constants/quotes";
import { VIDEOS } from "../constants/videos";
import { BLOG_POSTS } from "../constants/blog-posts";

const prisma = new PrismaClient();

const CATEGORY_NAMES = [
  "Discipline",
  "Resilience",
  "Success",
  "Focus",
  "Self-Belief",
  "Mindset",
  "Habits",
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PLATFORM_MAP: Record<(typeof VIDEOS)[number]["platform"], VideoPlatform> =
  {
    YouTube: VideoPlatform.YOUTUBE,
    Facebook: VideoPlatform.FACEBOOK,
    Shorts: VideoPlatform.SHORTS,
  };

async function main() {
  console.log("Seeding database...");

  // Admin user — matches the phone/contact identity already on the site.
  const admin = await prisma.user.upsert({
    where: { email: "admin@motivationalweapons.com" },
    update: {},
    create: {
      email: "admin@motivationalweapons.com",
      name: "Motivational Weapons",
      role: Role.ADMIN,
    },
  });

  // Categories — union of quote categories + blog categories.
  const categoryNames = Array.from(
    new Set([
      ...CATEGORY_NAMES,
      ...QUOTES.map((q) => q.category),
      ...BLOG_POSTS.map((p) => p.category),
    ])
  );

  const categories = new Map<string, string>();
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
    categories.set(name, category.id);
  }
  console.log(`  categories: ${categories.size}`);

  // Quotes
  for (const quote of QUOTES) {
    await prisma.quote.upsert({
      where: { id: quote.id },
      update: {},
      create: {
        id: quote.id,
        text: quote.text,
        author: quote.author,
        isDaily: quote.id === QUOTES[0]?.id,
        publishedAt: new Date(),
        categoryId: categories.get(quote.category),
      },
    });
  }
  console.log(`  quotes: ${QUOTES.length}`);

  // Videos
  for (const video of VIDEOS) {
    await prisma.video.upsert({
      where: { id: video.id },
      update: {},
      create: {
        id: video.id,
        title: video.title,
        platform: PLATFORM_MAP[video.platform],
        url: video.url,
        thumbnailUrl: video.thumbnail || null,
        featured: video.featured ?? false,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`  videos: ${VIDEOS.length}`);

  // Blog posts
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.excerpt, // placeholder body until the rich-text editor phase
        status: PostStatus.PUBLISHED,
        featured: post.featured ?? false,
        readTimeMinutes: parseInt(post.readTime, 10) || null,
        publishedAt: new Date(post.date),
        authorId: admin.id,
        categoryId: categories.get(post.category),
      },
    });
  }
  console.log(`  blog posts: ${BLOG_POSTS.length}`);

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
