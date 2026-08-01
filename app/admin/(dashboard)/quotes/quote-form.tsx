"use client";

import { useActionState } from "react";
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
import type { QuoteFormState } from "./actions";

export interface QuoteFormCategory {
  id: string;
  name: string;
}

export function QuoteForm({
  action,
  categories,
  defaultValues,
}: {
  action: (
    state: QuoteFormState | undefined,
    formData: FormData
  ) => Promise<QuoteFormState>;
  categories: QuoteFormCategory[];
  defaultValues?: {
    text: string;
    author: string;
    categoryId: string | null;
    isDaily: boolean;
  };
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="text">Quote text</Label>
        <Textarea
          id="text"
          name="text"
          defaultValue={defaultValues?.text}
          placeholder="The struggle you are in today is..."
          required
        />
        {state?.errors?.text ? (
          <p className="text-xs text-destructive">{state.errors.text[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          name="author"
          defaultValue={defaultValues?.author ?? "Motivational Weapons"}
          required
        />
        {state?.errors?.author ? (
          <p className="text-xs text-destructive">{state.errors.author[0]}</p>
        ) : null}
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
          name="isDaily"
          defaultChecked={defaultValues?.isDaily}
          className="h-4 w-4 rounded border-input"
        />
        Feature as today&rsquo;s quote
      </label>

      {state?.message ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <div className="flex gap-3">
        <SubmitButton>Save Quote</SubmitButton>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/quotes">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
