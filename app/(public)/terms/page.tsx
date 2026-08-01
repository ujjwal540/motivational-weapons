import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern use of the Motivational Weapons site.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            TERMS &amp; <span className="text-primary">CONDITIONS</span>
          </>
        }
        description="Last updated July 2026."
      />
      <section className="container max-w-2xl space-y-6 pb-24 text-muted-foreground">
        <p>
          This page is a placeholder for Motivational Weapons&rsquo; full terms
          of use. The complete legal text will be finalized alongside the
          authentication and admin systems in a later phase.
        </p>
        <p>
          In short: content on this site is for motivational and educational
          purposes only, all quotes and posts remain the property of
          Motivational Weapons unless stated otherwise, and by using the site
          you agree to use it respectfully and legally.
        </p>
      </section>
    </>
  );
}
