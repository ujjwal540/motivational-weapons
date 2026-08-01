import type { Metadata } from "next";
import Link from "next/link";

import { BrandMark } from "@/components/navbar/brand-mark";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = {
  title: "Admin Login | Motivational Weapons",
  description:
    "Sign in to the Motivational Weapons admin dashboard.",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-secondary/20 px-4 py-16">

      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-2"
      >
        <BrandMark />

        <span className="font-display text-lg tracking-wide text-foreground">
          MOTIVATIONAL{" "}
          <span className="text-primary">
            WEAPONS
          </span>
        </span>
      </Link>


      {/* Heading */}
      <div className="flex flex-col items-center gap-2 text-center">

        <h1 className="font-display text-3xl tracking-wide">
          ADMIN{" "}
          <span className="text-primary">
            ACCESS
          </span>
        </h1>

        <p className="max-w-sm text-sm text-muted-foreground">
          Sign in to manage quotes, videos, blog posts,
          users, and website content.
        </p>

      </div>


      {/* Login Form */}
      <AuthForm redirectTo="/admin/dashboard" />


      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        Use your authorized admin account only.
      </p>

    </main>
  );
}