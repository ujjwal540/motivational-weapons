"use client";

import * as React from "react";
import Link from "next/link";
import { Flame, Menu } from "lucide-react";

import { AdminSidebarNav } from "@/components/dashboard/admin-sidebar-nav";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CurrentUser } from "@/lib/auth";

export function AdminShell({
  user,
  children,
}: {
  user: CurrentUser;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card/50 lg:flex lg:flex-col">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 border-b border-border px-6 py-5"
        >
          <Flame className="h-5 w-5 text-primary" />
          <span className="font-display text-sm tracking-wide">
            MOTIVATIONAL <span className="text-primary">WEAPONS</span>
          </span>
        </Link>
        <div className="flex-1 overflow-y-auto p-4">
          <AdminSidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    MOTIVATIONAL <span className="text-primary">WEAPONS</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <AdminSidebarNav onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Signed in as{" "}
              <span className="font-medium text-foreground">
                {user.name ?? user.email}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 bg-secondary/10 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
