import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import { CoachChat } from "@/components/ai/coach-chat";

export const metadata: Metadata = {
  title: "AI Coach",
  description:
    "Talk to the Motivational Weapons AI Coach — practical, no-nonsense motivation for whatever you're working through.",
};

export default function AiCoachPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your Pocket Coach"
        title={
          <>
            AI <span className="text-primary">COACH</span>
          </>
        }
        description="Tell it what you're working through. It'll skip the fluff and give you something you can actually do."
      />
      <section className="container max-w-5xl pb-24">
        <CoachChat />
      </section>
    </>
  );
}
