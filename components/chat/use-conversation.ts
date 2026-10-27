"use client";

import * as Ably from "ably";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getMessages,
  markRead,
  sendMessage,
} from "@/app/actions/chat";
import {
  CHAT_EVENTS,
  messageNewPayloadSchema,
  userChannel,
} from "@/lib/ably/channels";
import { useChannel, useChannelStateListener, useConnectionStateListener } from "ably/react";
import type { MessageDTO } from "@/lib/chat/dto";

type ConfirmedMessage = Omit<MessageDTO, "cursor"> & { cursor?: string };

export type PendingMessage = {
  id: string;
  clientId: string;
  senderId: string;
  body: string;
  deleted: false;
  status: "pending" | "failed";
  error?: string;
  sequence: number;
};

export type ConversationMessage = ConfirmedMessage | PendingMessage;

type HookOptions = {
  conversationId: string;
  initialMessages: MessageDTO[];
  initialNextCursor: string | null;
  myProfileId: string;
};

function compareMessages(
  left: ConfirmedMessage,
  right: ConfirmedMessage,
): number {
  return (
    left.createdAt.localeCompare(right.createdAt) ||
    left.id.localeCompare(right.id)
  );
}

function actionErrorMessage(error: string): string {
  switch (error) {
    case "rate_limited":
      return "You're sending messages too quickly.";
    case "unauthorized":
      return "Please sign in again to send messages.";
    case "no_profile":
      return "Complete your profile before messaging.";
    case "not_found":
      return "This conversation is no longer available.";
    case "invalid_input":
      return "That message couldn't be sent. Check the text and try again.";
    default:
      return "Couldn't send your message. Please try again.";
  }
}

function mergeMessage(
  current: ConfirmedMessage[],
  incoming: ConfirmedMessage,
  myProfileId: string,
): ConfirmedMessage[] {
  const matchIndex = current.findIndex(
    (message) =>
      message.id === incoming.id ||
      (incoming.senderId === myProfileId &&
        message.senderId === myProfileId &&
        message.clientId === incoming.clientId),
  );

  if (matchIndex === -1) {
    return [...current, incoming].sort(compareMessages);
  }

  const updated = current.slice();
  updated[matchIndex] = { ...updated[matchIndex], ...incoming };
  return updated.sort(compareMessages);
}

export function useConversation({
  conversationId,
  initialMessages,
  initialNextCursor,
  myProfileId,
}: HookOptions) {
  const channelName = userChannel(myProfileId);
  const messageHandlerRef = useRef<(value: unknown) => void>(() => undefined);
  const { channel, ably, channelError, connectionError } = useChannel(
    channelName,
    CHAT_EVENTS.messageNew,
    (message: Ably.Message) => messageHandlerRef.current(message.data),
  );
  const [confirmed, setConfirmed] = useState<ConfirmedMessage[]>(() =>
    initialMessages.slice().sort(compareMessages),
  );
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [olderCursor, setOlderCursor] = useState(initialNextCursor);
  const [olderError, setOlderError] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [connectionState, setConnectionState] =
    useState<Ably.ConnectionState>(ably.connection.state);
  const [channelState, setChannelState] =
    useState<Ably.ChannelState>(channel.state);
  const [syncFailed, setSyncFailed] = useState(false);
  const [ownSendVersion, setOwnSendVersion] = useState(0);
  const catchUpCursorRef = useRef(
    initialMessages.length > 0
      ? initialMessages[initialMessages.length - 1].cursor
      : null,
  );
  const catchUpInProgressRef = useRef(false);
  const markReadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceRef = useRef(0);

  const scheduleMarkRead = useCallback(() => {
    if (markReadTimerRef.current) {
      clearTimeout(markReadTimerRef.current);
    }

    markReadTimerRef.current = setTimeout(() => {
      void markRead({ conversationId }).catch(() => undefined);
    }, 1000);
  }, [conversationId]);

  const handleMessage = useCallback(
    (value: unknown) => {
      const parsed = messageNewPayloadSchema.safeParse(value);

      if (!parsed.success || parsed.data.conversationId !== conversationId) {
        return;
      }

      const { message } = parsed.data;
      const received: ConfirmedMessage = {
        ...message,
        conversationId,
        deleted: false,
      };

      setConfirmed((current) => mergeMessage(current, received, myProfileId));

      if (message.senderId === myProfileId) {
        setPending((current) =>
          current.filter((item) => item.clientId !== message.clientId),
        );
        return;
      }

      if (document.visibilityState === "visible" && document.hasFocus()) {
        scheduleMarkRead();
      }
    },
    [conversationId, myProfileId, scheduleMarkRead],
  );

  useEffect(() => {
    messageHandlerRef.current = handleMessage;
  }, [handleMessage]);

  const catchUp = useCallback(async () => {
    if (catchUpInProgressRef.current) {
      return;
    }

    catchUpInProgressRef.current = true;

    try {
      let cursor = catchUpCursorRef.current;

      if (!cursor) {
        const result = await getMessages({ conversationId, limit: 50 });

        if (!result.ok) {
          setSyncFailed(true);
          return;
        }

        setConfirmed((current) =>
          result.data.items.reduce(
            (messages, message) => mergeMessage(messages, message, myProfileId),
            current,
          ),
        );
        setOlderCursor(result.data.nextCursor);
        const newest = result.data.items[result.data.items.length - 1];

        if (newest) {
          catchUpCursorRef.current = newest.cursor;
        }

        setSyncFailed(false);
        return;
      }

      for (let iteration = 0; iteration < 5; iteration += 1) {
        const result = await getMessages({
          conversationId,
          after: cursor,
          limit: 100,
        });

        if (!result.ok) {
          setSyncFailed(true);
          return;
        }

        if (result.data.items.length === 0) {
          break;
        }

        setConfirmed((current) =>
          result.data.items.reduce(
            (messages, message) => mergeMessage(messages, message, myProfileId),
            current,
          ),
        );

        const newest = result.data.items[result.data.items.length - 1];
        cursor = newest.cursor;
        catchUpCursorRef.current = cursor;

        if (!result.data.nextCursor) {
          break;
        }
      }

      setSyncFailed(false);
    } catch {
      setSyncFailed(true);
    } finally {
      catchUpInProgressRef.current = false;
    }
  }, [conversationId, myProfileId]);

  useConnectionStateListener((change) => {
    setConnectionState(change.current);
  });

  useChannelStateListener(channelName, (change) => {
    setChannelState(change.current);

    if (change.current === "attached") {
      void catchUp();
    }
  });

  const sendWithClientId = useCallback(
    async (clientId: string, body: string): Promise<boolean> => {
      setPending((current) =>
        current.map((item) =>
          item.clientId === clientId
            ? { ...item, status: "pending", error: undefined }
            : item,
        ),
      );

      try {
        const result = await sendMessage({ conversationId, clientId, body });

        if (!result.ok) {
          setPending((current) =>
            current.map((item) =>
              item.clientId === clientId
                ? {
                    ...item,
                    status: "failed",
                    error: actionErrorMessage(result.error),
                  }
                : item,
            ),
          );
          return false;
        }

        setConfirmed((current) =>
          mergeMessage(current, result.data, myProfileId),
        );
        setPending((current) =>
          current.filter((item) => item.clientId !== clientId),
        );
        setOwnSendVersion((version) => version + 1);
        return true;
      } catch {
        setPending((current) =>
          current.map((item) =>
            item.clientId === clientId
              ? {
                  ...item,
                  status: "failed",
                  error: "Couldn't send your message. Check your connection and retry.",
                }
              : item,
          ),
        );
        return false;
      }
    },
    [conversationId, myProfileId],
  );

  const send = useCallback(
    async (body: string): Promise<boolean> => {
      const trimmedBody = body.trim();

      if (!trimmedBody || trimmedBody.length > 2000) {
        return false;
      }

      const clientId = crypto.randomUUID();
      setPending((current) => [
        ...current,
        {
          id: `pending-${clientId}`,
          clientId,
          body: trimmedBody,
          senderId: myProfileId,
          status: "pending",
          sequence: sequenceRef.current++,
          deleted: false,
        },
      ]);
      setOwnSendVersion((version) => version + 1);
      return sendWithClientId(clientId, trimmedBody);
    },
    [myProfileId, sendWithClientId],
  );

  const retry = useCallback(
    (message: PendingMessage) =>
      sendWithClientId(message.clientId, message.body),
    [sendWithClientId],
  );

  const loadOlder = useCallback(async () => {
    if (!olderCursor || loadingOlder) {
      return null;
    }

    setLoadingOlder(true);
    setOlderError(null);

    try {
      const result = await getMessages({
        conversationId,
        cursor: olderCursor,
        limit: 30,
      });

      if (!result.ok) {
        setOlderError("Couldn't load older messages. Please try again.");
        return null;
      }

      setConfirmed((current) =>
        result.data.items.reduce(
          (messages, message) => mergeMessage(messages, message, myProfileId),
          current,
        ),
      );
      setOlderCursor(result.data.nextCursor);
      return result.data.items.length > 0;
    } catch {
      setOlderError("Couldn't load older messages. Please try again.");
      return null;
    } finally {
      setLoadingOlder(false);
    }
  }, [conversationId, loadingOlder, myProfileId, olderCursor]);

  useEffect(() => {
    scheduleMarkRead();
    return () => {
      if (markReadTimerRef.current) {
        clearTimeout(markReadTimerRef.current);
      }
    };
  }, [scheduleMarkRead]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void catchUp();
        scheduleMarkRead();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    if (channel.state === "attached") {
      const timer = setTimeout(() => void catchUp(), 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }

    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [catchUp, channel, scheduleMarkRead]);

  const messages = useMemo<ConversationMessage[]>(
    () => [
      ...confirmed,
      ...pending.slice().sort((left, right) => left.sequence - right.sequence),
    ],
    [confirmed, pending],
  );

  const unavailable =
    connectionState === "failed" ||
    connectionState === "suspended" ||
    connectionState === "closed" ||
    channelState === "failed" ||
    channelState === "suspended" ||
    Boolean(channelError || connectionError) ||
    syncFailed;

  return {
    messages,
    hasOlderMessages: olderCursor !== null,
    olderError,
    loadingOlder,
    loadOlder,
    send,
    retry,
    ownSendVersion,
    connectionState,
    unavailable,
  };
}
