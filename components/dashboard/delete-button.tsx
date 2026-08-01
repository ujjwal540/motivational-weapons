"use client";

import * as React from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  confirmMessage = "Are you sure? This can't be undone.",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      Delete
    </Button>
  );
}
