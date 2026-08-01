"use client";

import { useActionState, useRef, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { createCategory, type CategoryFormState } from "./actions";

const initialState: CategoryFormState = {};

export function CategoryForm() {
  const [state, formAction] = useActionState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.errors && !state.message) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-wrap items-start gap-3"
    >
      <div className="flex flex-col gap-1">
        <Input name="name" placeholder="e.g. Perseverance" required />
        {state.errors?.name ? (
          <p className="text-xs text-destructive">{state.errors.name[0]}</p>
        ) : null}
      </div>
      <SubmitButton pendingLabel="Adding...">Add Category</SubmitButton>
    </form>
  );
}
