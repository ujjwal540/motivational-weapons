"use client";

import * as React from "react";
import { Check, Loader2, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { approveComment, deleteComment, rejectComment } from "./actions";

export function CommentActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = React.useTransition();
  const [pendingAction, setPendingAction] = React.useState<
    "approve" | "reject" | "delete" | null
  >(null);

  function run(action: "approve" | "reject" | "delete") {
    setPendingAction(action);
    startTransition(async () => {
      if (action === "approve") await approveComment(id);
      if (action === "reject") await rejectComment(id);
      if (action === "delete") {
        if (!window.confirm("Delete this comment? This can't be undone.")) {
          setPendingAction(null);
          return;
        }
        await deleteComment(id);
      }
    });
  }

  return (
    <div className="flex justify-end gap-2">
      {status !== "APPROVED" ? (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run("approve")}
        >
          {pending && pendingAction === "approve" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          Approve
        </Button>
      ) : null}
      {status !== "REJECTED" ? (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run("reject")}
        >
          {pending && pendingAction === "reject" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
          Reject
        </Button>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => run("delete")}
      >
        {pending && pendingAction === "delete" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        Delete
      </Button>
    </div>
  );
}
