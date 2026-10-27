import "server-only";

import { Prisma } from "../generated/prisma/client";
import type {
  ConversationDTO,
  InboxItemDTO,
  MessageDTO,
} from "./dto";
import {
  mapConversationDTO,
  mapInboxItemDTO,
  mapMessageDTO,
  mapMessageNewPayload,
} from "./dto";
import { publishToUser } from "../ably/server";
import { prisma } from "../prisma";
import { enforceSendLimit } from "./rate-limit";
import {
  messageCursorSchema,
  type GetMessagesInput,
  type SendMessageInput,
} from "./schemas";

export type ChatServiceErrorCode =
  | "invalid_input"
  | "not_found"
  | "rate_limited";

export class ChatServiceError extends Error {
  constructor(readonly code: ChatServiceErrorCode) {
    super(code);
    this.name = "ChatServiceError";
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

async function requireParticipant(conversationId: string, profileId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      participantAId: true,
      participantBId: true,
    },
  });

  if (
    !conversation ||
    (conversation.participantAId !== profileId &&
      conversation.participantBId !== profileId)
  ) {
    throw new ChatServiceError("not_found");
  }

  return conversation;
}

function encodeCursor(cursor: { createdAt: Date; id: string }): string {
  return Buffer.from(
    JSON.stringify({
      createdAt: cursor.createdAt.toISOString(),
      id: cursor.id,
    }),
  ).toString("base64url");
}

function decodeCursor(cursor: string) {
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(cursor)) {
      throw new Error("Invalid cursor encoding.");
    }

    const decoded = Buffer.from(cursor, "base64url").toString("utf8");

    if (Buffer.from(decoded, "utf8").toString("base64url") !== cursor) {
      throw new Error("Invalid cursor encoding.");
    }

    const parsed: unknown = JSON.parse(decoded);
    const result = messageCursorSchema.safeParse(parsed);

    if (!result.success) {
      throw new Error("Invalid cursor payload.");
    }

    return {
      createdAt: new Date(result.data.createdAt),
      id: result.data.id,
    };
  } catch {
    throw new ChatServiceError("invalid_input");
  }
}

export async function findOrCreateConversation(
  profileId: string,
  username: string,
): Promise<ConversationDTO> {
  const target = await prisma.alumniProfile.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!target) {
    throw new ChatServiceError("not_found");
  }

  if (target.id === profileId) {
    throw new ChatServiceError("invalid_input");
  }

  const [participantAId, participantBId] =
    profileId < target.id
      ? [profileId, target.id]
      : [target.id, profileId];

  const findExisting = () =>
    prisma.conversation.findUnique({
      where: {
        participantAId_participantBId: {
          participantAId,
          participantBId,
        },
      },
      select: { id: true },
    });

  const existing = await findExisting();

  if (existing) {
    return mapConversationDTO(existing.id);
  }

  try {
    const conversation = await prisma.conversation.create({
      data: {
        participantAId,
        participantBId,
        participants: {
          create: [{ userId: participantAId }, { userId: participantBId }],
        },
      },
      select: { id: true },
    });

    return mapConversationDTO(conversation.id);
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const racedConversation = await findExisting();

    if (!racedConversation) {
      throw error;
    }

    return mapConversationDTO(racedConversation.id);
  }
}

export async function sendMessage(
  profileId: string,
  input: SendMessageInput,
): Promise<MessageDTO> {
  const conversation = await requireParticipant(
    input.conversationId,
    profileId,
  );

  if (!(await enforceSendLimit(profileId))) {
    throw new ChatServiceError("rate_limited");
  }

  let message;

  try {
    message = await prisma.$transaction(async (transaction) => {
      const createdMessage = await transaction.message.create({
        data: {
          conversationId: conversation.id,
          senderId: profileId,
          clientId: input.clientId,
          body: input.body,
        },
      });

      await transaction.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: createdMessage.createdAt },
      });

      return createdMessage;
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const existingMessage = await prisma.message.findUnique({
      where: {
        senderId_clientId: {
          senderId: profileId,
          clientId: input.clientId,
        },
      },
    });

    if (!existingMessage || existingMessage.conversationId !== conversation.id) {
      throw new ChatServiceError("invalid_input");
    }

    message = existingMessage;
  }

  const messageDTO = mapMessageDTO(message);
  const payload = mapMessageNewPayload(messageDTO);

  await Promise.all([
    publishToUser(conversation.participantAId, "message.new", payload),
    publishToUser(conversation.participantBId, "message.new", payload),
  ]);

  return messageDTO;
}

export async function getMessages(
  profileId: string,
  input: GetMessagesInput,
): Promise<{ items: MessageDTO[]; nextCursor: string | null }> {
  await requireParticipant(input.conversationId, profileId);

  const isCatchUp = input.after !== undefined;
  const limit = isCatchUp
    ? Math.min(input.limit ?? 30, 100)
    : Math.min(input.limit ?? 30, 50);
  const cursorToken = input.after ?? input.cursor;
  const cursor = cursorToken ? decodeCursor(cursorToken) : undefined;

  const messages = await prisma.message.findMany({
    where: {
      conversationId: input.conversationId,
      ...(cursor
        ? {
            OR: isCatchUp
              ? [
                  { createdAt: { gt: cursor.createdAt } },
                  { createdAt: cursor.createdAt, id: { gt: cursor.id } },
                ]
              : [
                  { createdAt: { lt: cursor.createdAt } },
                  { createdAt: cursor.createdAt, id: { lt: cursor.id } },
                ],
          }
        : {}),
    },
    orderBy: isCatchUp
      ? [{ createdAt: "asc" }, { id: "asc" }]
      : [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });

  const hasMore = messages.length > limit;
  const page = messages.slice(0, limit);

  if (!isCatchUp) {
    page.reverse();
  }

  const nextCursor =
    hasMore && page.length > 0
      ? encodeCursor({
          createdAt: isCatchUp
            ? page[page.length - 1].createdAt
            : page[0].createdAt,
          id: isCatchUp ? page[page.length - 1].id : page[0].id,
        })
      : null;

  return {
    items: page.map(mapMessageDTO),
    nextCursor,
  };
}

export async function markRead(
  profileId: string,
  conversationId: string,
): Promise<{ unread: 0 }> {
  await requireParticipant(conversationId, profileId);

  const now = new Date();

  await prisma.conversationParticipant.updateMany({
    where: {
      conversationId,
      userId: profileId,
      OR: [{ lastReadAt: null }, { lastReadAt: { lt: now } }],
    },
    data: { lastReadAt: now },
  });

  return { unread: 0 };
}

export async function getInbox(profileId: string): Promise<InboxItemDTO[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participantAId: profileId }, { participantBId: profileId }],
    },
    orderBy: { lastMessageAt: "desc" },
    take: 50,
    select: {
      id: true,
      lastMessageAt: true,
      participantAId: true,
      participantBId: true,
      participantA: {
        select: {
          id: true,
          fullName: true,
          username: true,
          profileImageUrl: true,
        },
      },
      participantB: {
        select: {
          id: true,
          fullName: true,
          username: true,
          profileImageUrl: true,
        },
      },
      participants: {
        where: { userId: profileId },
        select: { lastReadAt: true },
      },
      messages: {
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 1,
        select: { body: true, deletedAt: true },
      },
    },
  });

  if (conversations.length === 0) {
    return [];
  }

  const unreadCounts = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      senderId: { not: profileId },
      deletedAt: null,
      OR: conversations.map((conversation) => {
        const participant = conversation.participants[0];
        return {
          conversationId: conversation.id,
          ...(participant?.lastReadAt
            ? { createdAt: { gt: participant.lastReadAt } }
            : {}),
        };
      }),
    },
    _count: { id: true },
  });

  const unreadByConversation = new Map(
    unreadCounts.map((entry) => [entry.conversationId, entry._count.id]),
  );

  return conversations.map((conversation) => {
    const otherParticipant =
      conversation.participantAId === profileId
        ? conversation.participantB
        : conversation.participantA;
    const lastMessage = conversation.messages[0];
    const lastMessagePreview =
      !lastMessage || lastMessage.deletedAt
        ? null
        : lastMessage.body.length > 100
          ? `${lastMessage.body.slice(0, 97)}...`
          : lastMessage.body;

    return mapInboxItemDTO({
      conversationId: conversation.id,
      otherParticipant,
      lastMessagePreview,
      lastMessageAt: conversation.lastMessageAt.toISOString(),
      unreadCount: unreadByConversation.get(conversation.id) ?? 0,
    });
  });
}
