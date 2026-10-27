import type { Message } from "../generated/prisma/client";
import type { MessageNewPayload } from "../ably/channels";

export type MessageDTO = {
  id: string;
  clientId: string;
  conversationId: string;
  senderId: string;
  body: string | null;
  createdAt: string;
  cursor: string;
  deleted: boolean;
};

export type ConversationDTO = {
  conversationId: string;
};

export type ConversationHeaderDTO = {
  conversationId: string;
  otherParticipant: {
    id: string;
    fullName: string;
    username: string;
    profileImageUrl: string | null;
  };
};

export type InboxItemDTO = {
  conversationId: string;
  otherParticipant: {
    id: string;
    fullName: string;
    username: string;
    profileImageUrl: string | null;
  };
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
};

export function mapMessageDTO(message: Message, cursor: string): MessageDTO {
  const deleted = message.deletedAt !== null;

  return {
    id: message.id,
    clientId: message.clientId,
    conversationId: message.conversationId,
    senderId: message.senderId,
    body: deleted ? null : message.body,
    createdAt: message.createdAt.toISOString(),
    cursor,
    deleted,
  };
}

export function mapMessageNewPayload(message: MessageDTO): MessageNewPayload {
  return {
    conversationId: message.conversationId,
    message: {
      id: message.id,
      clientId: message.clientId,
      senderId: message.senderId,
      body: message.body ?? "",
      createdAt: message.createdAt,
    },
  };
}

export function mapConversationDTO(id: string): ConversationDTO {
  return { conversationId: id };
}

export function mapConversationHeaderDTO(
  conversationId: string,
  otherParticipant: ConversationHeaderDTO["otherParticipant"],
): ConversationHeaderDTO {
  return {
    conversationId,
    otherParticipant: {
      id: otherParticipant.id,
      fullName: otherParticipant.fullName,
      username: otherParticipant.username,
      profileImageUrl: otherParticipant.profileImageUrl,
    },
  };
}

export function mapInboxItemDTO(item: InboxItemDTO): InboxItemDTO {
  return {
    conversationId: item.conversationId,
    otherParticipant: {
      id: item.otherParticipant.id,
      fullName: item.otherParticipant.fullName,
      username: item.otherParticipant.username,
      profileImageUrl: item.otherParticipant.profileImageUrl,
    },
    lastMessagePreview: item.lastMessagePreview,
    lastMessageAt: item.lastMessageAt,
    unreadCount: item.unreadCount,
  };
}
