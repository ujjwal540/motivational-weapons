"use client";

import * as React from "react";
import { Ban, Loader2, ShieldCheck, ShieldOff, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleUserBlocked, toggleUserRole } from "./actions";

export function UserActions({
  id,
  role,
  blocked,
  isSelf,
}: {
  id: string;
  role: string;
  blocked: boolean;
  isSelf: boolean;
}) {
  const [pending, startTransition] = React.useTransition();
  const [pendingAction, setPendingAction] = React.useState<
    "role" | "blocked" | null
  >(null);

  if (isSelf) {
    return (
      <p className="text-right text-xs text-muted-foreground">This is you</p>
    );
  }

  function run(action: "role" | "blocked") {
    setPendingAction(action);
    startTransition(async () => {
      if (action === "role") await toggleUserRole(id);
      if (action === "blocked") await toggleUserBlocked(id);
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => run("role")}
      >
        {pending && pendingAction === "role" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : role === "ADMIN" ? (
          <ShieldOff className="h-3.5 w-3.5" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5" />
        )}
        {role === "ADMIN" ? "Demote" : "Promote"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => run("blocked")}
      >
        {pending && pendingAction === "blocked" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : blocked ? (
          <Undo2 className="h-3.5 w-3.5" />
        ) : (
          <Ban className="h-3.5 w-3.5" />
        )}
        {blocked ? "Unblock" : "Block"}
      </Button>
    </div>
  );
}
