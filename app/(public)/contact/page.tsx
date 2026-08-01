import type { Metadata } from "next";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

import { PageHeader } from "@/components/hero/page-header";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Motivational Weapons — questions, collaborations, or your own success story.",
};

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone",
    value: "+977 980-4209993",
    href: "tel:+9779804209993",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@motivationalweapons.com",
    href: "mailto:hello@motivationalweapons.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Ranighat, Birgunj, Nepal",
    href: undefined,
  },
] as const;

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Let's Talk"
        title={
          <>
            GET IN <span className="text-primary">TOUCH</span>
          </>
        }
        description="Questions, collaborations, or your own struggle-into-strength story — we read every message."
      />

      <section className="container grid gap-10 pb-24 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-6">
            {CONTACT_DETAILS.map((detail) => {
              const content = (
                <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <detail.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {detail.label}
                    </p>
                    <p className="font-medium text-foreground">
                      {detail.value}
                    </p>
                  </div>
                </div>
              );
              return detail.href ? (
                <a key={detail.label} href={detail.href}>
                  {content}
                </a>
              ) : (
                <div key={detail.label}>{content}</div>
              );
            })}

            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 lg:col-span-3">
          <h2 className="font-display text-2xl tracking-wide">
            SEND A <span className="text-primary">MESSAGE</span>
          </h2>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Fill this out and we&rsquo;ll get back to you within 2 business
            days.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
