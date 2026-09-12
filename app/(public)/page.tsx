import Link from "next/link";
import { Flame, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuoteCard } from "@/components/quote/quote-card";
import { VideoCard } from "@/components/video/video-card";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { prisma } from "@/lib/prisma";
import { STATS, TESTIMONIALS } from "@/constants/site-content";
import type { Quote, Video } from "@/types";

const PILLARS = [
  {
    title: "Daily Motivation",
    description:
      "A fresh dose of power delivered every morning to start the day sharp.",
  },
  {
    title: "Quotes & Videos",
    description:
      "Hand-picked lines and clips built to snap you out of excuses.",
  },
  {
    title: "Success Stories",
    description:
      "Real accounts of people who turned struggle into their sharpest weapon.",
  },
] as const;

export default async function HomePage() {
  const [dailyQuote, featuredVideo] = await Promise.all([
    prisma.quote.findFirst({
      where: { isDaily: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.video.findFirst({
      where: { featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const quote: Quote = dailyQuote
    ? {
        id: dailyQuote.id,
        text: dailyQuote.text,
        author: dailyQuote.author,
        category: dailyQuote.category?.name ?? "Uncategorized",
      }
    : {
        id: "quote-fallback",
        text: "The struggle you are in today is developing the strength you need for tomorrow.",
        author: "Motivational Weapons",
        category: "Resilience",
      };

  const video: Video = featuredVideo
    ? {
        id: featuredVideo.id,
        title: featuredVideo.title,
        platform:
          featuredVideo.platform === "YOUTUBE"
            ? "YouTube"
            : featuredVideo.platform === "FACEBOOK"
              ? "Facebook"
              : "Shorts",
        duration:
          featuredVideo.durationSeconds != null
            ? `${Math.floor(featuredVideo.durationSeconds / 60)}:${String(
                featuredVideo.durationSeconds % 60
              ).padStart(2, "0")}`
            : "Watch",
        thumbnail: featuredVideo.thumbnailUrl ?? "",
        url: featuredVideo.url,
        featured: featuredVideo.featured,
      }
    : {
        id: "video-fallback",
        title: "5 AM Is a Weapon: Building the Unbreakable Morning",
        platform: "YouTube",
        duration: "8:42",
        thumbnail: "",
        url: "https://www.youtube.com/results?search_query=5am+morning+motivation+discipline",
      };

  return (
    <>
      {/* Hero */}
      <section className="container flex flex-col items-center gap-6 py-24 text-center">
        <Badge variant="ember" className="gap-1.5">
          <Flame className="h-3.5 w-3.5" />
          Daily power, forged for you
        </Badge>
        <h1 className="max-w-3xl font-display text-5xl leading-tight tracking-wide sm:text-7xl">
          TURN YOUR STRUGGLES INTO YOUR{" "}
          <span className="text-primary">STRENGTH</span>
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Welcome to Motivational Weapons — where every quote, video, and story
          is forged to keep you moving when quitting feels easier.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" variant="ember" asChild>
            <Link href="/daily-motivation">Get Today&rsquo;s Motivation</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/videos">Watch the Videos</Link>
          </Button>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="font-display text-3xl tracking-wide text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="container grid gap-6 py-24 md:grid-cols-3">
        {PILLARS.map((pillar) => (
          <Card key={pillar.title}>
            <CardHeader>
              <CardTitle>{pillar.title}</CardTitle>
              <CardDescription>{pillar.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="ember-line" />
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Featured quote + featured video */}
      <section className="container grid gap-8 pb-24 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl tracking-wide">
            TODAY&rsquo;S <span className="text-primary">QUOTE</span>
          </h2>
          <QuoteCard quote={quote} className="flex-1" />
          <Button variant="link" asChild className="w-fit px-0">
            <Link href="/quotes">Browse every quote &rarr;</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl tracking-wide">
            FEATURED <span className="text-primary">VIDEO</span>
          </h2>
          <VideoCard video={video} />
          <Button variant="link" asChild className="w-fit px-0">
            <Link href="/videos">Watch the full library &rarr;</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/30 py-24">
        <div className="container flex flex-col items-center gap-4 text-center">
          <Badge variant="ember">What the arsenal is saying</Badge>
          <h2 className="max-w-lg font-display text-3xl tracking-wide sm:text-4xl">
            REAL PEOPLE. REAL <span className="text-primary">MOMENTUM.</span>
          </h2>
        </div>
        <div className="container mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center sm:p-16">
          <div className="ember-line absolute inset-x-0 top-0" />
          <Mail className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 font-display text-3xl tracking-wide sm:text-4xl">
            NEVER MISS A <span className="text-primary">DAILY WEAPON</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Join the newsletter for one motivational weapon in your inbox every
            morning. No spam — just power.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
