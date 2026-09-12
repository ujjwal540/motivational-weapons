import type { Metadata } from "next";
import { Flame, Mail, ShieldCheck, Sword, Target } from "lucide-react";

import { PageHeader } from "@/components/hero/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Motivational Weapons — why we turn struggles into strength, and what we stand for.",
};

const VALUES = [
  {
    icon: Flame,
    title: "Struggle Is Fuel",
    description:
      "Every hardship you're facing is raw material. We help you forge it into strength instead of letting it forge you into fear.",
  },
  {
    icon: Sword,
    title: "Discipline Over Mood",
    description:
      "Motivation gets you started. Discipline is the weapon that keeps working after the motivation fades.",
  },
  {
    icon: Target,
    title: "Small, Sharp, Daily",
    description:
      "We don't chase hype. One clear quote or story a day, sharp enough to actually change how you show up.",
  },
  {
    icon: ShieldCheck,
    title: "No Toxic Positivity",
    description:
      "We won't tell you to just smile through it. We'll tell you the truth, and the truth is stronger.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={
          <>
            BUILT FOR THE <span className="text-primary">FIGHT</span>, NOT THE
            HIGHLIGHT REEL
          </>
        }
        description="Motivational Weapons started as one page sharing hard truths to a handful of friends. It's grown into a daily arsenal for 45,000+ people who refuse to quit."
      />

      <section className="container grid gap-10 pb-20 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl tracking-wide">
            WHY WE <span className="text-primary">EXIST</span>
          </h2>
          <p className="text-muted-foreground">
            Most motivation online is loud for five seconds and forgotten by
            lunch. We wanted something different — content built like a weapon:
            forged with intention, sharp enough to cut through excuses, and
            reliable enough to reach for on your worst day.
          </p>
          <p className="text-muted-foreground">
            Motivational Weapons is run from Ranighat, Birgunj, Nepal, by a
            small team obsessed with one idea: your struggle is not your
            weakness. It&rsquo;s the raw steel your strength is made from.
          </p>
          <a
            href="mailto:motivationalweapons@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Mail className="h-4 w-4" />
            motivationalweapons@gmail.com
          </a>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="font-display text-2xl leading-snug tracking-wide text-foreground sm:text-3xl">
            &ldquo;We turn struggles into strength.&rdquo;
          </p>
          <div className="ember-line mt-6" />
          <p className="mt-6 text-sm text-muted-foreground">
            That single line has guided every quote, video, and post we&rsquo;ve
            published since day one — and it still does.
          </p>
        </div>
      </section>

      <section className="container pb-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl tracking-wide">
            WHAT WE <span className="text-primary">STAND FOR</span>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <Card key={value.title}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
                  <value.icon className="h-5 w-5" />
                </span>
                <div>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription className="mt-1.5">
                    {value.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
