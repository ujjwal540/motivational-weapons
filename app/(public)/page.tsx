import Link from "next/link";
import { ArrowRight, BrainCircuit, Flame, Mail, Sparkles, Target } from "lucide-react";

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
      <section className="relative isolate overflow-hidden border-b border-border/70">
        <div className="hero-grid absolute inset-0 -z-10 opacity-70" />
        <div className="hero-orb absolute -left-24 top-16 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="hero-orb absolute -right-20 top-32 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="container grid min-h-[calc(100vh-4.5rem)] items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="flex max-w-3xl flex-col items-start gap-7">
            <Badge variant="ember" className="gap-2 border-primary/30 bg-primary/10 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered personal growth
            </Badge>
            <h1 className="font-display text-6xl leading-[0.92] tracking-[0.02em] sm:text-8xl">
              TRAIN YOUR <span className="bg-gradient-to-r from-primary via-cyan-300 to-accent bg-clip-text text-transparent">MIND.</span><br />
              BUILD YOUR <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">FUTURE.</span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              A sharper daily system for discipline, resilience, and momentum. Get the next useful step when life feels loud.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" variant="ember" asChild>
                <Link href="/ai-coach">Start with the AI Coach <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/daily-motivation">Open today&rsquo;s weapon</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Daily focus</span>
              <span className="inline-flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-accent" /> Practical support</span>
            </div>
          </div>
          <div className="relative mx-auto min-h-[23rem] w-full max-w-md">
            <div className="hero-float glass-panel absolute left-0 top-8 w-[78%] rounded-2xl p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground"><span>Today&rsquo;s focus</span><Flame className="h-4 w-4 text-primary" /></div>
              <p className="mt-8 font-display text-3xl leading-tight tracking-wide">One clear action beats ten perfect plans.</p>
              <div className="mt-8 flex items-center gap-2 text-sm text-primary"><span className="h-2 w-2 rounded-full bg-primary" /> Momentum is live</div>
            </div>
            <div className="hero-float-delayed glass-panel absolute bottom-4 right-0 w-[72%] rounded-2xl p-5">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent"><BrainCircuit className="h-4 w-4" /></span><div><p className="text-sm font-medium">AI Coach</p><p className="text-xs text-muted-foreground">Ready when you are</p></div></div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">Turn the problem into a smaller next step.</p>
            </div>
          </div>
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
