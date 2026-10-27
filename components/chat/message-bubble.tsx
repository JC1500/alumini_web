"use client";

import type { ConversationMessage, PendingMessage } from "./use-conversation";
import { Button } from "@/components/ui/button";

function isPendingMessage(
  message: ConversationMessage,
): message is PendingMessage {
  return "status" in message;
}

export default function MessageBubble({
  message,
  mine,
  grouped,
  onRetry,
}: {
  message: ConversationMessage;
  mine: boolean;
  grouped: boolean;
  onRetry: (message: PendingMessage) => void;
}) {
  const pending = isPendingMessage(message) ? message : null;
  const timestamp = isPendingMessage(message) ? null : new Date(message.createdAt);
  const timeLabel = timestamp
    ? new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(timestamp)
    : null;

  return (
    <li
      className={`flex min-w-0 ${mine ? "justify-end" : "justify-start"} ${
        grouped ? "mt-1" : "mt-4"
      }`}
    >
      <div
        className={`min-w-0 max-w-[85%] rounded-2xl px-3.5 py-2.5 sm:max-w-[75%] ${
          mine
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground"
        } ${pending?.status === "failed" ? "ring-1 ring-destructive/60" : ""}`}
      >
        {message.deleted ? (
          <p className="text-sm italic text-muted-foreground">
            This message was deleted
          </p>
        ) : (
          <p className="[overflow-wrap:anywhere] whitespace-pre-wrap text-sm leading-6">
            {message.body}
          </p>
        )}
        <div
          className={`mt-1 flex items-center justify-end gap-2 text-[0.7rem] ${
            mine ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {pending ? (
            <span>
              {pending.status === "pending" ? "Sending…" : "Failed to send"}
            </span>
          ) : (
            timeLabel && (
              <time dateTime={timestamp?.toISOString()}>{timeLabel}</time>
            )
          )}
        </div>
        {pending?.status === "failed" && (
          <div className="mt-1 text-right">
            <p className="text-xs text-destructive">{pending.error}</p>
            <Button
              type="button"
              size="xs"
              variant="link"
              className="h-auto px-0 py-1 text-xs text-current"
              aria-label="Retry sending this message"
              onClick={() => onRetry(pending)}
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
