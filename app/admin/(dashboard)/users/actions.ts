"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function toggleUserRole(id: string): Promise<void> {
  const currentUser = await requireAdmin();

  if (id === currentUser.id) {
    throw new Error("You can't change your own role.");
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  await prisma.user.update({
    where: { id },
    data: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
  });
  revalidatePath("/admin/users");
}

export async function toggleUserBlocked(id: string): Promise<void> {
  const currentUser = await requireAdmin();

  if (id === currentUser.id) {
    throw new Error("You can't block your own account.");
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  await prisma.user.update({
    where: { id },
    data: { blocked: !user.blocked },
  });
  revalidatePath("/admin/users");
}
