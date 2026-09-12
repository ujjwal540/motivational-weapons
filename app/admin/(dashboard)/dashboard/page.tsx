import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Quote as QuoteIcon,
  Users,
  Video,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

async function getStats() {
  // Counted independently (rather than one big query) so a failure in one
  // model doesn't blank the whole dashboard, and so this reads clearly as
  // "one card, one count."
  const [quotes, videos, posts, users, pendingComments, subscribers] =
    await Promise.all([
      prisma.quote.count(),
      prisma.video.count(),
      prisma.blogPost.count(),
      prisma.user.count(),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
    ]);

  return { quotes, videos, posts, users, pendingComments, subscribers };
}

const QUICK_LINKS = [
  {
    href: "/admin/quotes",
    icon: QuoteIcon,
    label: "Quotes",
    statKey: "quotes",
    description: "Manage the daily quote arsenal",
  },
  {
    href: "/admin/videos",
    icon: Video,
    label: "Videos",
    statKey: "videos",
    description: "YouTube, Facebook Reels, Shorts",
  },
  {
    href: "/admin/blogs",
    icon: FileText,
    label: "Blog Posts",
    statKey: "posts",
    description: "Long-form articles",
  },
  {
    href: "/admin/comments",
    icon: MessageSquare,
    label: "Comments",
    statKey: "pendingComments",
    description: "Awaiting moderation",
  },
  {
    href: "/admin/users",
    icon: Users,
    label: "Users",
    statKey: "users",
    description: "Registered accounts",
  },
] as const;

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Personal growth command center</p>
        <h1 className="mt-3 font-display text-4xl tracking-wide">
          DASHBOARD <span className="text-primary">OVERVIEW</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          A snapshot of everything live on Motivational Weapons right now.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Quotes" value={stats.quotes} />
        <StatCard label="Videos" value={stats.videos} />
        <StatCard label="Blog Posts" value={stats.posts} />
        <StatCard label="Users" value={stats.users} />
        <StatCard label="Pending Comments" value={stats.pendingComments} />
        <StatCard label="Subscribers" value={stats.subscribers} />
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl tracking-wide">
          MANAGE <span className="text-primary">CONTENT</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <link.icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg">{link.label}</CardTitle>
                      <Badge variant="ember">
                        {stats[link.statKey as keyof typeof stats]}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {link.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coming in later phases</CardTitle>
          <CardDescription>
            SEO panel, site settings, and the newsletter composer round out the
            admin dashboard in upcoming phases. Everything above is fully wired
            to the database today.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="font-display text-3xl tracking-wide text-primary">
          {value}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}
