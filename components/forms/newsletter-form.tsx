"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  subscribeToNewsletter,
  type NewsletterFormState,
} from "@/app/(public)/newsletter-actions";

const initialState: NewsletterFormState = {};

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    initialState
  );

  if (state.status === "success") {
    return (
      <p className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 text-sm font-medium text-primary">
        <Check className="h-4 w-4" />
        {state.message}
      </p>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-md">
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          aria-label="Email address"
          required
          className="flex-1"
        />
        <Button type="submit" variant="ember" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Subscribe
        </Button>
      </form>
      {state.status === "error" ? (
        <p className="mt-2 text-sm text-destructive">{state.message}</p>
      ) : null}
    </div>
  );
}
