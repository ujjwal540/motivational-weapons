import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import { QuotesGrid } from "@/components/quote/quotes-grid";

export const metadata: Metadata = {
  title: "Quotes",
  description:
    "Browse every Motivational Weapons quote by category — discipline, resilience, success, focus, and self-belief.",
};

export default function QuotesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Full Arsenal"
        title={
          <>
            QUOTES THAT <span className="text-primary">CUT DEEP</span>
          </>
        }
        description="Filter by what you need today — discipline, resilience, focus, or a straight shot of self-belief."
      />
      <section className="container pb-24">
        <QuotesGrid />
      </section>
    </>
  );
}
