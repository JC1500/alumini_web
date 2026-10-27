"use client";

import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import { useEffect, useState, type ReactNode } from "react";

type AblyClientProviderProps = {
  children: ReactNode;
};

function isTokenRequest(value: unknown): value is Ably.TokenRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "capability" in value &&
    typeof value.capability === "string" &&
    "keyName" in value &&
    typeof value.keyName === "string" &&
    "mac" in value &&
    typeof value.mac === "string" &&
    "nonce" in value &&
    typeof value.nonce === "string" &&
    "timestamp" in value &&
    typeof value.timestamp === "number"
  );
}

export default function AblyClientProvider({
  children,
}: AblyClientProviderProps) {
  const [client, setClient] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    let active = true;
    const realtimeClient = new Ably.Realtime({
      authCallback: (_tokenParams, callback) => {
        void fetch("/api/ably/auth", { cache: "no-store" })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(
                `Ably authorization failed with status ${response.status}.`,
              );
            }

            const tokenRequest: unknown = await response.json();

            if (!isTokenRequest(tokenRequest)) {
              throw new Error("Ably authorization returned an invalid token request.");
            }

            callback(null, tokenRequest);
          })
          .catch((error: unknown) => {
            callback(
              error instanceof Error
                ? error.message
                : "Unable to authorize real-time messaging.",
              null,
            );
          });
      },
    });

    queueMicrotask(() => {
      if (active) {
        setClient(realtimeClient);
      }
    });

    return () => {
      active = false;
      realtimeClient.close();
    };
  }, []);

  if (!client) {
    return null;
  }

  return <AblyProvider client={client}>{children}</AblyProvider>;
}
