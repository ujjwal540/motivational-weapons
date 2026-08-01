"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { slugify } from "@/lib/utils";
import type { PostFormState } from "./actions";

export interface PostFormCategory {
  id: string;
  name: string;
}

export function PostForm({
  action,
  categories,
  defaultValues,
}: {
  action: (
    state: PostFormState | undefined,
    formData: FormData
  ) => Promise<PostFormState>;
  categories: PostFormCategory[];
  defaultValues?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
    categoryId: string | null;
    featured: boolean;
  };
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          onChange={(event) => {
            if (!slugTouched) {
              setSlug(slugify(event.target.value));
            }
          }}
          required
        />
        {state?.errors?.title ? (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          required
        />
        <p className="text-xs text-muted-foreground">/blog/{slug || "..."}</p>
        {state?.errors?.slug ? (
          <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={defaultValues?.excerpt}
          required
        />
        {state?.errors?.excerpt ? (
          <p className="text-xs text-destructive">{state.errors.excerpt[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          rows={10}
          defaultValue={defaultValues?.content}
          required
        />
        {state?.errors?.content ? (
          <p className="text-xs text-destructive">{state.errors.content[0]}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Plain text for now — a rich-text editor lands in a later phase.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={defaultValues?.status ?? "DRAFT"}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            name="categoryId"
            defaultValue={defaultValues?.categoryId ?? undefined}
          >
            <SelectTrigger id="categoryId">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={defaultValues?.featured}
          className="h-4 w-4 rounded border-input"
        />
        Feature at the top of /blog
      </label>

      {state?.message ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <div className="flex gap-3">
        <SubmitButton>Save Post</SubmitButton>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/blogs">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
