"use client";

import * as React from "react";
import { Loader2, Mail, MailX, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteSubscriber, toggleSubscriberActive } from "./actions";

export function SubscriberActions({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [pending, startTransition] = React.useTransition();
  const [pendingAction, setPendingAction] = React.useState<
    "toggle" | "delete" | null
  >(null);

  function run(action: "toggle" | "delete") {
    setPendingAction(action);
    startTransition(async () => {
      if (action === "toggle") await toggleSubscriberActive(id);
      if (action === "delete") {
        if (!window.confirm("Remove this subscriber permanently?")) {
          setPendingAction(null);
          return;
        }
        await deleteSubscriber(id);
      }
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => run("toggle")}
      >
        {pending && pendingAction === "toggle" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : active ? (
          <MailX className="h-3.5 w-3.5" />
        ) : (
          <Mail className="h-3.5 w-3.5" />
        )}
        {active ? "Unsubscribe" : "Resubscribe"}
      </Button>
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
