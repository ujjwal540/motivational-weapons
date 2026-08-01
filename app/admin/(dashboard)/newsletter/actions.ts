"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function toggleSubscriberActive(id: string): Promise<void> {
  await requireAdmin();

  const subscriber = await prisma.newsletterSubscriber.findUniqueOrThrow({
    where: { id },
  });

  await prisma.newsletterSubscriber.update({
    where: { id },
    data: subscriber.active
      ? { active: false, unsubscribedAt: new Date() }
      : { active: true, unsubscribedAt: null },
  });

  revalidatePath("/admin/newsletter");
}

export async function deleteSubscriber(id: string): Promise<void> {
  await requireAdmin();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}
