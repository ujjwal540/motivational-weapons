import type { Metadata } from "next";
import Link from "next/link";

import { BrandMark } from "@/components/navbar/brand-mark";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Motivational Weapons to comment on posts.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Only ever redirect to a same-site path — never trust an absolute or
  // protocol-relative URL from a query string (open-redirect protection).
  const redirectTo = next && next.startsWith("/") ? next : "/";

  return (
    <div className="flex min-h-[calc(100vh-1px)] flex-col items-center justify-center gap-8 bg-secondary/20 px-4 py-16">
      <Link href="/" className="flex items-center gap-2">
        <BrandMark />
        <span className="font-display text-lg tracking-wide text-foreground">
          MOTIVATIONAL <span className="text-primary">WEAPONS</span>
        </span>
      </Link>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl tracking-wide">
          WELCOME <span className="text-primary">BACK</span>
        </h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Sign in to join the conversation and comment on posts.
        </p>
      </div>
      <AuthForm redirectTo={redirectTo} />
    </div>
  );
}
