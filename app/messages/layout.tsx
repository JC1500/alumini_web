import type { ReactNode } from "react";
import AblyClientProvider from "@/components/chat/ably-provider";

export default function MessagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AblyClientProvider>{children}</AblyClientProvider>;
}
