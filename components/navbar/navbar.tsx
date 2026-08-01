"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BrandMark } from "@/components/navbar/brand-mark";

const NAV_LINKS = [
  { href: "/daily-motivation", label: "Daily Motivation" },
  { href: "/videos", label: "Videos" },
  { href: "/quotes", label: "Quotes" },
  { href: "/blog", label: "Blog" },
  { href: "/ai-coach", label: "AI Coach" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "relative py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        isActive && "text-foreground"
      )}
    >
      {label}
      {isActive && (
        <span className="ember-line absolute -bottom-1 left-0 h-[2px] w-full" />
      )}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark />
          <span className="font-display text-lg tracking-wide text-foreground">
            MOTIVATIONAL <span className="text-primary">WEAPONS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ember" size="sm" asChild>
            <Link href="/daily-motivation">Join the Arsenal</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BrandMark />
                  Motivational Weapons
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.href}
                    {...link}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
                <Button
                  variant="ember"
                  className="mt-2 w-full"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/daily-motivation">Join the Arsenal</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="ember-line" />
    </header>
  );
}
