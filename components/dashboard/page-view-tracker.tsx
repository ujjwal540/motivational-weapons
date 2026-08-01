"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    }).catch(() => {
      // Best-effort — a dropped analytics ping shouldn't affect the visit.
    });
  }, [pathname]);

  return null;
}
