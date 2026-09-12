"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/dashboard/submit-button";
import type { VideoFormState } from "./actions";

export interface VideoFormCategory {
  id: string;
  name: string;
}

export function VideoForm({
  action,
  categories,
  defaultValues,
}: {
  action: (
    state: VideoFormState | undefined,
    formData: FormData
  ) => Promise<VideoFormState>;
  categories: VideoFormCategory[];
  defaultValues?: {
    title: string;
    platform: "YOUTUBE" | "FACEBOOK" | "SHORTS";
    url: string;
    thumbnailUrl: string | null;
    categoryId: string | null;
    featured: boolean;
  };
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} encType="multipart/form-data" className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
        />
        {state?.errors?.title ? (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="platform">Platform</Label>
        <Select name="platform" defaultValue={defaultValues?.platform}>
          <SelectTrigger id="platform">
            <SelectValue placeholder="Select a platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="YOUTUBE">YouTube</SelectItem>
            <SelectItem value="FACEBOOK">Facebook Reels</SelectItem>
            <SelectItem value="SHORTS">Shorts</SelectItem>
          </SelectContent>
        </Select>
        {state?.errors?.platform ? (
          <p className="text-xs text-destructive">{state.errors.platform[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="url">Video URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          defaultValue={defaultValues?.url}
          required
        />
        {state?.errors?.url ? (
          <p className="text-xs text-destructive">{state.errors.url[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="thumbnailUrl">Thumbnail URL (optional)</Label>
        <Input
          id="thumbnailUrl"
          name="thumbnailUrl"
          type="url"
          placeholder="https://..."
          defaultValue={defaultValues?.thumbnailUrl ?? ""}
        />
        {state?.errors?.thumbnailUrl ? (
          <p className="text-xs text-destructive">
            {state.errors.thumbnailUrl[0]}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="thumbnailFile">Or upload thumbnail image</Label>
        <Input id="thumbnailFile" name="thumbnailFile" type="file" accept="image/*" />
        <p className="text-xs text-muted-foreground">
          Uploading a file will override the URL field when saved.
        </p>
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

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={defaultValues?.featured}
          className="h-4 w-4 rounded border-input"
        />
        Feature on homepage
      </label>

      {state?.message ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <div className="flex gap-3">
        <SubmitButton>Save Video</SubmitButton>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/videos">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
