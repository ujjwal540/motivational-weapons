"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const { signOutUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOutUser();
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={loading}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
