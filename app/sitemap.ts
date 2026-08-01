import type { MetadataRoute } from "next";

import { BLOG_POSTS } from "@/constants/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/about",
  "/daily-motivation",
  "/videos",
  "/blog",
  "/quotes",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
];

/**
 * Deliberately built from `constants/blog-posts.ts` rather than a Prisma
 * query — this file is generated at build time alongside every other
 * static route (see the README note on `/blog/[slug]` and
 * `generateStaticParams`), and querying the database here would introduce
 * the same build-time DB dependency Phases 6/7 went out of their way to
 * avoid.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
