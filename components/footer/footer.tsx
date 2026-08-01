import Link from "next/link";
import { Facebook, Instagram, Youtube, Phone } from "lucide-react";

import { BrandMark } from "@/components/navbar/brand-mark";

const EXPLORE_LINKS = [
  { href: "/daily-motivation", label: "Daily Motivation" },
  { href: "/videos", label: "Videos" },
  { href: "/quotes", label: "Quotes" },
  { href: "/blog", label: "Blog" },
  { href: "/ai-coach", label: "AI Coach" },
] as const;

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <BrandMark />
              <span className="font-display text-lg tracking-wide">
                MOTIVATIONAL <span className="text-primary">WEAPONS</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Turning struggles into strength — daily power, mindset &amp;
              motivation to never quit.
            </p>
            <a
              href="tel:+9779804209993"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              +977 980-4209993
            </a>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-wider text-primary">
              EXPLORE
            </h3>
            <ul className="mt-4 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-wider text-primary">
              COMPANY
            </h3>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-wider text-primary">
              CONNECT
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com"
                aria-label="YouTube"
                className="text-muted-foreground hover:text-foreground"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="ember-line" />

      <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
        <p>&copy; {year} Motivational Weapons. All rights reserved.</p>
        <div className="flex gap-5">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
