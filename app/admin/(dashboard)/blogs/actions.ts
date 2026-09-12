"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters."),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters."),
  content: z.string().min(20, "Content must be at least 20 characters."),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  categoryId: z.string().optional(),
  featured: z.boolean().optional(),
});

export interface PostFormState {
  errors?: Partial<
    Record<"title" | "slug" | "excerpt" | "content" | "status", string[]>
  >;
  message?: string;
}

function parsePostFormData(formData: FormData) {
  const rawTitle = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "");

  return postSchema.safeParse({
    title: rawTitle,
    slug: slugify(rawSlug || rawTitle),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    status: formData.get("status"),
    categoryId: formData.get("categoryId") || undefined,
    featured: formData.get("featured") === "on",
  });
}

async function resolveCoverImageUrl(formData: FormData) {
  const coverImageFile = formData.get("coverImageFile");
  if (coverImageFile instanceof File && coverImageFile.size > 0) {
    return uploadImageToCloudinary(
      coverImageFile,
      "motivational-weapons/blog-covers"
    );
  }

  return String(formData.get("coverImageUrl") || "").trim() || null;
}

export async function createPost(
  _prevState: PostFormState | undefined,
  formData: FormData
): Promise<PostFormState> {
  const user = await requireAdmin();

  const parsed = parsePostFormData(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.blogPost.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { errors: { slug: ["That slug is already in use."] } };
  }

  try {
    const coverImage = await resolveCoverImageUrl(formData);

    await prisma.blogPost.create({
      data: {
        ...parsed.data,
        authorId: user.id,
        coverImage,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });
  } catch {
    return { message: "Something went wrong creating the post." };
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  redirect("/admin/blogs");
}

export async function updatePost(
  id: string,
  _prevState: PostFormState | undefined,
  formData: FormData
): Promise<PostFormState> {
  await requireAdmin();

  const parsed = parsePostFormData(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.blogPost.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing && existing.id !== id) {
    return { errors: { slug: ["That slug is already in use."] } };
  }

  try {
    const coverImage = await resolveCoverImageUrl(formData);

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...parsed.data,
        coverImage,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });
  } catch {
    return { message: "Something went wrong updating the post." };
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  redirect("/admin/blogs");
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
}
