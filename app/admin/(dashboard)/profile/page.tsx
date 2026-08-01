import type { Metadata } from "next";

import { PasswordChangeForm } from "./password-change-form";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default function AdminProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          ADMIN <span className="text-primary">PROFILE</span>
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Change your password from inside the dashboard. This uses your
          Firebase sign-in, so it works for email/password accounts. Google or
          demo-auth users will see guidance instead of a password form.
        </p>
      </div>

      <PasswordChangeForm />
    </div>
  );
}
