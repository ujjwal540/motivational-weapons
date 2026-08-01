import type { Metadata } from "next";
import { Eye, Globe, Smartphone } from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageViewsChart,
  type DailyViewCount,
} from "@/components/dashboard/page-views-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

const DAYS_TO_SHOW = 14;

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

interface PathViewCount {
  path: string;
  _count: { path: number };
}

interface DeviceViewCount {
  device: string | null;
  _count: { device: number };
}

async function getAnalytics(): Promise<{
  chartData: DailyViewCount[];
  totalViews: number;
  last14DaysViews: number;
  topPaths: PathViewCount[];
  deviceCounts: DeviceViewCount[];
}> {
  const since = new Date();
  since.setDate(since.getDate() - (DAYS_TO_SHOW - 1));
  since.setHours(0, 0, 0, 0);

  const [recentViews, totalViews, topPaths, deviceCounts] = await Promise.all([
    prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.pageView.count(),
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    prisma.pageView.groupBy({
      by: ["device"],
      _count: { device: true },
    }),
  ]);

  // Bucket the raw rows into one count per day so the chart always shows a
  // full 14-day range, including days with zero views.
  const bucket = new Map<string, number>();
  for (let i = 0; i < DAYS_TO_SHOW; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    bucket.set(dayKey(d), 0);
  }
  for (const view of recentViews) {
    const key = dayKey(view.createdAt);
    bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }

  const chartData: DailyViewCount[] = Array.from(bucket.entries()).map(
    ([date, views]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      views,
    })
  );

  return {
    chartData,
    totalViews,
    last14DaysViews: recentViews.length,
    topPaths,
    deviceCounts,
  };
}

export default async function AdminAnalyticsPage() {
  const { chartData, totalViews, last14DaysViews, topPaths, deviceCounts } =
    await getAnalytics();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          ANALYTICS <span className="text-primary">OVERVIEW</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          First-party page-view tracking — no third-party analytics involved.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent">
              <Eye className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl tracking-wide">
                {totalViews}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                All-time views
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl tracking-wide">
                {last14DaysViews}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Last {DAYS_TO_SHOW} days
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent">
              <Smartphone className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl tracking-wide">
                {deviceCounts.length}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Device types seen
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Views, last {DAYS_TO_SHOW} days
          </CardTitle>
          <CardDescription>
            Recorded by the tracker mounted on every public page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PageViewsChart data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top pages</CardTitle>
          <CardDescription>All-time, by view count.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {topPaths.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No page views recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Path</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPaths.map((row) => (
                  <TableRow key={row.path}>
                    <TableCell className="font-mono text-xs">
                      {row.path}
                    </TableCell>
                    <TableCell className="text-right">
                      {row._count.path}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
