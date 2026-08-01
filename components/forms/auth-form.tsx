"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleIcon } from "@/components/icons/google-icon";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Enter your full name."),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export function AuthForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const demoAuthEnabled =
    process.env.NEXT_PUBLIC_USE_FAKE_AUTH === "true" ||
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const [tab, setTab] = React.useState<"sign-in" | "sign-up">("sign-in");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });
  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  async function handleSignIn(values: SignInValues) {
    setFormError(null);
    try {
      await signInWithEmail(values.email, values.password);
      router.push(redirectTo);
      router.refresh();
    } catch {
      setFormError("Couldn't sign in with those credentials.");
    }
  }

  async function handleSignUp(values: SignUpValues) {
    setFormError(null);
    try {
      await signUpWithEmail(values.name, values.email, values.password);
      router.push(redirectTo);
      router.refresh();
    } catch {
      setFormError("Couldn't create that account. The email may be taken.");
    }
  }

  async function handleGoogle() {
    setFormError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push(redirectTo);
      router.refresh();
    } catch {
      setFormError("Google sign-in was cancelled or failed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "sign-in" | "sign-up")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="sign-in">
          <form
            onSubmit={signInForm.handleSubmit(handleSignIn)}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                {...signInForm.register("email")}
              />
              {signInForm.formState.errors.email ? (
                <p className="text-xs text-destructive">
                  {signInForm.formState.errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                {...signInForm.register("password")}
              />
              {signInForm.formState.errors.password ? (
                <p className="text-xs text-destructive">
                  {signInForm.formState.errors.password.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              variant="ember"
              className="mt-2"
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Sign In
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="sign-up">
          <form
            onSubmit={signUpForm.handleSubmit(handleSignUp)}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input
                id="signup-name"
                placeholder="Your name"
                {...signUpForm.register("name")}
              />
              {signUpForm.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.name.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                {...signUpForm.register("email")}
              />
              {signUpForm.formState.errors.email ? (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="At least 6 characters"
                {...signUpForm.register("password")}
              />
              {signUpForm.formState.errors.password ? (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.password.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              variant="ember"
              className="mt-2"
              disabled={signUpForm.formState.isSubmitting}
            >
              {signUpForm.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Create Account
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {demoAuthEnabled ? (
        <p className="mb-4 text-center text-xs text-muted-foreground">
          Demo mode is active. Use any valid email and password to continue.
        </p>
      ) : null}

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        Continue with Google
      </Button>

      {formError ? (
        <p className="mt-4 text-center text-sm text-destructive">{formError}</p>
      ) : null}
    </div>
  );
}
