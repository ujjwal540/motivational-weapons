import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { CategoryForm } from "./category-form";
import { deleteCategory } from "./actions";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

interface CategoryRow {
  id: string;
  name: string;
  _count: { quotes: number; videos: number; posts: number };
}

export default async function AdminCategoriesPage() {
  const categories: CategoryRow[] = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { quotes: true, videos: true, posts: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          CATEGORIES <span className="text-primary">({categories.length})</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shared across quotes, videos, and blog posts.
        </p>
      </div>

      <CategoryForm />

      {categories.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No categories yet — add one above.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quotes</TableHead>
              <TableHead>Videos</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category._count.quotes}</TableCell>
                <TableCell>{category._count.videos}</TableCell>
                <TableCell>{category._count.posts}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DeleteButton
                      action={deleteCategory.bind(null, category.id)}
                      confirmMessage="Delete this category? Content using it will become uncategorized."
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
