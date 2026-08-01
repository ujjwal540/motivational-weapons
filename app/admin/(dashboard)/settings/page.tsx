import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          SITE <span className="text-primary">SETTINGS</span>
        </h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Site identity, SEO defaults, and social links. Note: the public site
          currently ships static brand assets and metadata for performance (see
          the README) — these fields are saved for real, but wiring the live
          pages to read them is a follow-up phase.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
