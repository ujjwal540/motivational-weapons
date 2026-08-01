"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function approveComment(id: string): Promise<void> {
  await requireAdmin();
  await prisma.comment.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath("/admin/comments");
}

export async function rejectComment(id: string): Promise<void> {
  await requireAdmin();
  await prisma.comment.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/comments");
}

export async function deleteComment(id: string): Promise<void> {
  await requireAdmin();
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/admin/comments");
}
