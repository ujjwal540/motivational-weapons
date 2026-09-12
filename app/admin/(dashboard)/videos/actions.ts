"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const videoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  platform: z.enum(["YOUTUBE", "FACEBOOK", "SHORTS"], {
    errorMap: () => ({ message: "Select a platform." }),
  }),
  url: z.string().url("Enter a valid URL."),
  thumbnailUrl: z
    .string()
    .url("Enter a valid URL.")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().optional(),
  featured: z.boolean().optional(),
});

export interface VideoFormState {
  errors?: Partial<
    Record<"title" | "platform" | "url" | "thumbnailUrl", string[]>
  >;
  message?: string;
}

function parseVideoFormData(formData: FormData) {
  return videoSchema.safeParse({
    title: formData.get("title"),
    platform: formData.get("platform"),
    url: formData.get("url"),
    thumbnailUrl: formData.get("thumbnailUrl") || "",
    categoryId: formData.get("categoryId") || undefined,
    featured: formData.get("featured") === "on",
  });
}

async function resolveThumbnailUrl(formData: FormData) {
  const thumbnailFile = formData.get("thumbnailFile");
  if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
    return uploadImageToCloudinary(thumbnailFile, "motivational-weapons/videos");
  }

  return String(formData.get("thumbnailUrl") || "").trim() || null;
}

export async function createVideo(
  _prevState: VideoFormState | undefined,
  formData: FormData
): Promise<VideoFormState> {
  await requireAdmin();

  const parsed = parseVideoFormData(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const thumbnailUrl = await resolveThumbnailUrl(formData);

    await prisma.video.create({
      data: {
        ...parsed.data,
        thumbnailUrl,
        publishedAt: new Date(),
      },
    });
  } catch {
    return { message: "Something went wrong creating the video." };
  }

  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function updateVideo(
  id: string,
  _prevState: VideoFormState | undefined,
  formData: FormData
): Promise<VideoFormState> {
  await requireAdmin();

  const parsed = parseVideoFormData(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const thumbnailUrl = await resolveThumbnailUrl(formData);

    await prisma.video.update({
      where: { id },
      data: { ...parsed.data, thumbnailUrl },
    });
  } catch {
    return { message: "Something went wrong updating the video." };
  }

  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function deleteVideo(id: string): Promise<void> {
  await requireAdmin();
  await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
}
