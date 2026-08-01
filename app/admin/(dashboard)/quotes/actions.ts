"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const quoteSchema = z.object({
  text: z.string().min(10, "Quote must be at least 10 characters."),
  author: z.string().min(1, "Author is required."),
  categoryId: z.string().optional(),
  isDaily: z.boolean().optional(),
});

export interface QuoteFormState {
  errors?: Partial<Record<"text" | "author", string[]>>;
  message?: string;
}

function parseQuoteFormData(formData: FormData) {
  return quoteSchema.safeParse({
    text: formData.get("text"),
    author: formData.get("author"),
    categoryId: formData.get("categoryId") || undefined,
    isDaily: formData.get("isDaily") === "on",
  });
}

export async function createQuote(
  _prevState: QuoteFormState | undefined,
  formData: FormData
): Promise<QuoteFormState> {
  await requireAdmin();

  const parsed = parseQuoteFormData(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.quote.create({
      data: { ...parsed.data, publishedAt: new Date() },
    });
  } catch {
    return { message: "Something went wrong creating the quote." };
  }

  revalidatePath("/admin/quotes");
  redirect("/admin/quotes");
}

export async function updateQuote(
  id: string,
  _prevState: QuoteFormState | undefined,
  formData: FormData
): Promise<QuoteFormState> {
  await requireAdmin();

  const parsed = parseQuoteFormData(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.quote.update({ where: { id }, data: parsed.data });
  } catch {
    return { message: "Something went wrong updating the quote." };
  }

  revalidatePath("/admin/quotes");
  redirect("/admin/quotes");
}

export async function deleteQuote(id: string): Promise<void> {
  await requireAdmin();
  await prisma.quote.delete({ where: { id } });
  revalidatePath("/admin/quotes");
}
