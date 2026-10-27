"use client";

import type { Ref } from "react";
import MessageBubble from "./message-bubble";
import type { ConversationMessage, PendingMessage } from "./use-conversation";

function sameGroup(
  previous: ConversationMessage | undefined,
  current: ConversationMessage,
) {
  if (!previous || previous.senderId !== current.senderId) {
    return false;
  }

  if ("status" in previous || "status" in current) {
    return false;
  }

  return (
    Math.abs(
      new Date(current.createdAt).getTime() -
        new Date(previous.createdAt).getTime(),
    ) <=
    5 * 60 * 1000
  );
}

export default function MessageList({
  messages,
  myProfileId,
  containerRef,
  hasOlderMessages,
  olderError,
  loadingOlder,
  onLoadOlder,
  onRetry,
  onScroll,
  showNewMessages,
  onShowNewMessages,
}: {
  messages: ConversationMessage[];
  myProfileId: string;
  containerRef: Ref<HTMLDivElement>;
  hasOlderMessages: boolean;
  olderError: string | null;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: (message: PendingMessage) => void;
  onScroll: () => void;
  showNewMessages: boolean;
  onShowNewMessages: () => void;
}) {
  return (
    <div
      ref={containerRef}
      role="log"
      aria-label="Conversation messages"
      aria-live="polite"
      aria-relevant="additions text"
      onScroll={onScroll}
      className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6"
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-end">
        {hasOlderMessages && (
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={onLoadOlder}
              disabled={loadingOlder}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              aria-label="Load older messages"
            >
              {loadingOlder ? "Loading…" : "Load older messages"}
            </button>
          </div>
        )}
        {olderError && (
          <p role="status" className="mb-3 text-center text-sm text-destructive">
            {olderError}
          </p>
        )}
        <ol className="flex flex-col">
          {messages.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. Send a message to get started.
            </li>
          )}
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              mine={message.senderId === myProfileId}
              grouped={sameGroup(messages[index - 1], message)}
              onRetry={onRetry}
            />
          ))}
        </ol>
      </div>
      {showNewMessages && (
        <button
          type="button"
          onClick={onShowNewMessages}
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Scroll to new messages"
        >
          New messages
        </button>
      )}
    </div>
  );
}
