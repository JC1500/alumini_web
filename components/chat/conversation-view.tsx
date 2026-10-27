"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ChannelProvider } from "ably/react";
import ConnectionBanner from "./connection-banner";
import MessageComposer from "./message-composer";
import MessageList from "./message-list";
import { useConversation } from "./use-conversation";
import { userChannel } from "@/lib/ably/channels";
import type { ConversationHeaderDTO, MessageDTO } from "@/lib/chat/dto";
import type { PendingMessage } from "./use-conversation";

export default function ConversationView({
  conversation,
  initialMessages,
  initialNextCursor,
  myProfileId,
}: {
  conversation: ConversationHeaderDTO;
  initialMessages: MessageDTO[];
  initialNextCursor: string | null;
  myProfileId: string;
}) {
  return (
    <ChannelProvider channelName={userChannel(myProfileId)}>
      <ConversationViewContent
        conversation={conversation}
        initialMessages={initialMessages}
        initialNextCursor={initialNextCursor}
        myProfileId={myProfileId}
      />
    </ChannelProvider>
  );
}

function ConversationViewContent({
  conversation,
  initialMessages,
  initialNextCursor,
  myProfileId,
}: {
  conversation: ConversationHeaderDTO;
  initialMessages: MessageDTO[];
  initialNextCursor: string | null;
  myProfileId: string;
}) {
  const {
    messages,
    hasOlderMessages,
    olderError,
    loadingOlder,
    loadOlder,
    send,
    retry,
    ownSendVersion,
    connectionState,
    unavailable,
  } = useConversation({
    conversationId: conversation.conversationId,
    initialMessages,
    initialNextCursor,
    myProfileId,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const shouldPreserveScrollRef = useRef<{
    height: number;
    top: number;
  } | null>(null);
  const previousMessageCountRef = useRef(messages.length);
  const previousOwnSendVersionRef = useRef(ownSendVersion);
  const firstRenderRef = useRef(true);
  const [showNewMessages, setShowNewMessages] = useState(false);

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
      nearBottomRef.current = true;
      setShowNewMessages(false);
    }
  }, []);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const previousMessageCount = previousMessageCountRef.current;
    previousMessageCountRef.current = messages.length;

    if (ownSendVersion > previousOwnSendVersionRef.current) {
      previousOwnSendVersionRef.current = ownSendVersion;
      scrollToBottom();
      return;
    }

    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      scrollToBottom();
      return;
    }

    const preserved = shouldPreserveScrollRef.current;
    if (preserved) {
      container.scrollTop =
        preserved.top + (container.scrollHeight - preserved.height);
      shouldPreserveScrollRef.current = null;
      return;
    }

    if (messages.length > previousMessageCount) {
      if (nearBottomRef.current) {
        scrollToBottom();
      } else {
        setShowNewMessages(true);
      }
    }
  }, [messages, ownSendVersion, scrollToBottom]);

  const onLoadOlder = async () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    shouldPreserveScrollRef.current = {
      height: container.scrollHeight,
      top: container.scrollTop,
    };
    const loaded = await loadOlder();
    if (!loaded) {
      shouldPreserveScrollRef.current = null;
    }
  };

  const onScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    nearBottomRef.current = distanceFromBottom <= 100;

    if (nearBottomRef.current) {
      setShowNewMessages(false);
    }
  };

  const onRetry = (message: PendingMessage) => {
    void retry(message);
  };

  return (
    <main className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-background px-3 py-3 sm:px-6">
        <Link
          href={`/u/${encodeURIComponent(conversation.otherParticipant.username)}`}
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            {conversation.otherParticipant.profileImageUrl ? (
              <img
                src={conversation.otherParticipant.profileImageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              conversation.otherParticipant.fullName
                .trim()
                .charAt(0)
                .toUpperCase() || "A"
            )}
          </div>
          <span className="min-w-0">
            <span className="block truncate font-semibold">
              {conversation.otherParticipant.fullName}
            </span>
            <span className="block truncate text-sm text-muted-foreground">
              @{conversation.otherParticipant.username}
            </span>
          </span>
        </Link>
      </header>
      <ConnectionBanner
        key={`${connectionState}:${unavailable}`}
        connectionState={connectionState}
        unavailable={unavailable}
      />
      <MessageList
        messages={messages}
        myProfileId={myProfileId}
        containerRef={scrollContainerRef}
        hasOlderMessages={hasOlderMessages}
        olderError={olderError}
        loadingOlder={loadingOlder}
        onLoadOlder={() => void onLoadOlder()}
        onRetry={onRetry}
        onScroll={onScroll}
        showNewMessages={showNewMessages}
        onShowNewMessages={scrollToBottom}
      />
      <MessageComposer onSend={send} />
    </main>
  );
}
