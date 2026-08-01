"use client";

import * as React from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, isFirebaseConfigured } from "@/firebase/config";
import { useAuth } from "@/context/auth-context";

export function PasswordChangeForm() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const demoAuthEnabled =
    process.env.NEXT_PUBLIC_USE_FAKE_AUTH === "true" || !isFirebaseConfigured;
  const canChangePassword = Boolean(user?.email && auth?.currentUser) && !demoAuthEnabled;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!canChangePassword || !auth?.currentUser || !user?.email) {
      setError("Password changes are unavailable in demo mode or with this sign-in method.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
    } catch (submitError) {
      const code = submitError instanceof Error ? submitError.message : "";
      if (code.includes("auth/wrong-password") || code.includes("auth/invalid-credential")) {
        setError("Current password is incorrect.");
      } else if (code.includes("requires-recent-login")) {
        setError("Please sign out and sign in again before changing your password.");
      } else {
        setError("Could not update the password. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            This changes the Firebase password for the currently signed-in admin
            account. It requires a recent login for safety.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            disabled={!canChangePassword || submitting}
            placeholder="Enter your current password"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            disabled={!canChangePassword || submitting}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={!canChangePassword || submitting}
            placeholder="Repeat the new password"
          />
        </div>

        <Button type="submit" variant="ember" disabled={!canChangePassword || submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Update password
        </Button>

        {message ? (
          <p className="text-sm text-primary">{message}</p>
        ) : null}
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
      </form>

      <aside className="rounded-2xl border border-border bg-secondary/20 p-6">
        <h2 className="font-display text-xl tracking-wide">ACCOUNT NOTES</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Google sign-in users should change their password in Google, not
            here.
          </li>
          <li className="flex gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Demo auth mode cannot persist real password changes.
          </li>
          <li className="flex gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            If Firebase says your login is too old, sign out and sign in again
            before retrying.
          </li>
        </ul>
      </aside>
    </section>
  );
}