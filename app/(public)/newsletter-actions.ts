"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

const emailSchema = z.string().email("Enter a valid email address.");

export interface NewsletterFormState {
  status?: "success" | "error";
  message?: string;
}

export async function subscribeToNewsletter(
  _prevState: NewsletterFormState | undefined,
  formData: FormData
): Promise<NewsletterFormState> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data },
      update: { active: true, unsubscribedAt: null },
      create: { email: parsed.data },
    });
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return {
    status: "success",
    message: "You're in — welcome to the arsenal.",
  };
}
