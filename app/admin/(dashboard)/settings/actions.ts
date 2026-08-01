"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { SITE_SETTINGS_ID } from "@/lib/settings";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.string().url().safeParse(value).success, {
    message: "Enter a valid URL.",
  })
  .transform((value) => (value ? value : null));

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.string().email().safeParse(value).success, {
    message: "Enter a valid email.",
  })
  .transform((value) => (value ? value : null));

const settingsSchema = z.object({
  siteName: z.string().trim().min(1, "Site name can't be empty."),
  tagline: optionalString,
  logoUrl: optionalUrl,
  heroBannerUrl: optionalUrl,
  contactEmail: optionalEmail,
  contactPhone: optionalString,
  socialFacebook: optionalUrl,
  socialInstagram: optionalUrl,
  socialYoutube: optionalUrl,
  metaTitle: optionalString,
  metaDescription: optionalString,
  ogImageUrl: optionalUrl,
  twitterHandle: optionalString,
});

export interface SettingsFormState {
  status?: "success" | "error";
  message?: string;
  errors?: Record<string, string>;
}

export async function updateSiteSettings(
  _prevState: SettingsFormState | undefined,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string") errors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the errors below.", errors };
  }

  await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: parsed.data,
    create: { id: SITE_SETTINGS_ID, ...parsed.data },
  });

  revalidatePath("/admin/settings");

  return { status: "success", message: "Settings saved." };
}
