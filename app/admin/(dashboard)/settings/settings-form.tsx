"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SiteSettingsData } from "@/lib/settings";
import { updateSiteSettings, type SettingsFormState } from "./actions";

const initialState: SettingsFormState = {};

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  errors,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue: string | null;
  placeholder?: string;
  errors?: Record<string, string>;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        aria-invalid={!!errors?.[name]}
      />
      {errors?.[name] ? (
        <p className="text-xs text-destructive">{errors[name]}</p>
      ) : null}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettingsData }) {
  const [state, formAction, isPending] = useActionState(
    updateSiteSettings,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="flex flex-col gap-5">
          <Field
            name="siteName"
            label="Site name"
            defaultValue={settings.siteName}
            errors={state.errors}
          />
          <Field
            name="tagline"
            label="Tagline"
            defaultValue={settings.tagline}
            placeholder="Turn your struggles into strength"
            errors={state.errors}
          />
          <Field
            name="logoUrl"
            label="Logo URL"
            defaultValue={settings.logoUrl}
            placeholder="https://..."
            errors={state.errors}
          />
          <Field
            name="heroBannerUrl"
            label="Hero banner URL"
            defaultValue={settings.heroBannerUrl}
            placeholder="https://..."
            errors={state.errors}
          />
          <Field
            name="contactEmail"
            label="Contact email"
            defaultValue={settings.contactEmail}
            type="email"
            errors={state.errors}
          />
          <Field
            name="contactPhone"
            label="Contact phone"
            defaultValue={settings.contactPhone}
            errors={state.errors}
          />
        </TabsContent>

        <TabsContent value="seo" className="flex flex-col gap-5">
          <Field
            name="metaTitle"
            label="Default meta title"
            defaultValue={settings.metaTitle}
            placeholder="Motivational Weapons"
            errors={state.errors}
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="metaDescription">Default meta description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              defaultValue={settings.metaDescription ?? ""}
              placeholder="Daily power, mindset, and motivation to never quit."
            />
            {state.errors?.metaDescription ? (
              <p className="text-xs text-destructive">
                {state.errors.metaDescription}
              </p>
            ) : null}
          </div>
          <Field
            name="ogImageUrl"
            label="Open Graph image URL"
            defaultValue={settings.ogImageUrl}
            placeholder="https://..."
            errors={state.errors}
          />
          <Field
            name="twitterHandle"
            label="Twitter / X handle"
            defaultValue={settings.twitterHandle}
            placeholder="@motivationalweapons"
            errors={state.errors}
          />
        </TabsContent>

        <TabsContent value="social" className="flex flex-col gap-5">
          <Field
            name="socialFacebook"
            label="Facebook URL"
            defaultValue={settings.socialFacebook}
            placeholder="https://facebook.com/..."
            errors={state.errors}
          />
          <Field
            name="socialInstagram"
            label="Instagram URL"
            defaultValue={settings.socialInstagram}
            placeholder="https://instagram.com/..."
            errors={state.errors}
          />
          <Field
            name="socialYoutube"
            label="YouTube URL"
            defaultValue={settings.socialYoutube}
            placeholder="https://youtube.com/..."
            errors={state.errors}
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" variant="ember" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save Settings
        </Button>
        {state.status === "success" ? (
          <p className="flex items-center gap-1.5 text-sm text-primary">
            <Check className="h-4 w-4" />
            {state.message}
          </p>
        ) : null}
        {state.status === "error" ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
