import type { Metadata } from "next";
import "@fontsource/bebas-neue";
import "@fontsource-variable/inter";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_DESCRIPTION =
  "Motivational Weapons - daily power, mindset, and motivation to never quit. Quotes, videos, and success stories.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Motivational Weapons",
    template: "%s | Motivational Weapons",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Motivational Weapons",
    title: "Motivational Weapons",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Motivational Weapons",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
