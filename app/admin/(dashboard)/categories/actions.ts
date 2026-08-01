"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export interface CategoryFormState {
  errors?: Partial<Record<"name", string[]>>;
  message?: string;
}

export async function createCategory(
  _prevState: CategoryFormState | undefined,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const slug = slugify(parsed.data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { errors: { name: ["A category with that name already exists."] } };
  }

  await prisma.category.create({ data: { name: parsed.data.name, slug } });
  revalidatePath("/admin/categories");
  return {};
}

export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
