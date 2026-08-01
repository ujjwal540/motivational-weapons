import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Motivational Weapons collects, uses, and protects data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            PRIVACY <span className="text-primary">POLICY</span>
          </>
        }
        description="Last updated July 2026."
      />
      <section className="container max-w-2xl space-y-6 pb-24 text-muted-foreground">
        <p>
          This page is a placeholder for Motivational Weapons&rsquo; full
          privacy policy. The complete legal text — covering what data we
          collect, how it&rsquo;s stored, and your rights over it — will be
          finalized alongside the authentication and newsletter systems in a
          later phase.
        </p>
        <p>
          In short: we only collect what&rsquo;s needed to run the newsletter
          and contact form, we never sell your data, and you can request its
          deletion at any time by reaching out through the{" "}
          <a
            href="/contact"
            className="text-primary underline-offset-4 hover:underline"
          >
            Contact page
          </a>
          .
        </p>
      </section>
    </>
  );
}
