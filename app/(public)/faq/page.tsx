import type { Metadata } from "next";

import { PageHeader } from "@/components/hero/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/constants/site-content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Motivational Weapons.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quick Answers"
        title={
          <>
            FREQUENTLY <span className="text-primary">ASKED</span>
          </>
        }
        description="Everything you need to know before joining the arsenal."
      />
      <section className="container max-w-2xl pb-24">
        <Accordion type="single" collapsible>
          {FAQS.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
