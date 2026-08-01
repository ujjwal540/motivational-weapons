import "server-only";

import { prisma } from "@/lib/prisma";

export const SITE_SETTINGS_ID = "singleton";

export interface SiteSettingsData {
  siteName: string;
  tagline: string | null;
  logoUrl: string | null;
  heroBannerUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialYoutube: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  twitterHandle: string | null;
}

/**
 * Reads the one-and-only settings row, creating it with defaults on first
 * access so the admin Settings page always has something to render — the
 * table starts empty (it isn't part of the Phase 4 seed) rather than
 * assuming a row exists.
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: {},
    create: { id: SITE_SETTINGS_ID },
  });

  return settings;
}
