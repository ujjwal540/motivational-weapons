import Link from "next/link";

export default function Custom404() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
        Page not found
      </p>
      <h1 className="font-display text-4xl tracking-wide">
        THIS PAGE WAS FORGED ELSEWHERE
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you were looking for does not exist or was moved.
      </p>
      <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Return home
      </Link>
    </main>
  );
}