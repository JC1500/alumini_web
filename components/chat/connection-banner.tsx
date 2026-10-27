"use client";

import { useEffect, useState } from "react";
import type * as Ably from "ably";

export default function ConnectionBanner({
  connectionState,
  unavailable,
}: {
  connectionState: Ably.ConnectionState;
  unavailable: boolean;
}) {
  const [showReconnecting, setShowReconnecting] = useState(false);

  useEffect(() => {
    if (connectionState === "connected" || unavailable) {
      return;
    }

    const timer = setTimeout(() => setShowReconnecting(true), 2000);
    return () => clearTimeout(timer);
  }, [connectionState, unavailable]);

  if (unavailable) {
    return (
      <div
        role="status"
        className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive"
      >
        Chat is unavailable. Refresh the page.
      </div>
    );
  }

  if (connectionState === "connected" || !showReconnecting) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-border bg-muted px-4 py-2 text-center text-sm text-muted-foreground"
    >
      Reconnecting...
    </div>
  );
}
