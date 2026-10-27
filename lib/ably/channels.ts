import { z } from "zod";
import { conversationIdSchema } from "../chat/schemas";

export function userChannel(profileId: string): string {
  return `user:${profileId}`;
}

export const CHAT_EVENTS = {
  messageNew: "message.new",
} as const;

export type MessageNewPayload = {
  conversationId: string;
  message: {
    id: string;
    clientId: string;
    senderId: string;
    body: string;
    createdAt: string;
  };
};

export const messageNewPayloadSchema = z.object({
  conversationId: conversationIdSchema,
  message: z.object({
    id: conversationIdSchema,
    clientId: z.string().uuid(),
    senderId: z.string().min(1),
    body: z.string().max(2000),
    createdAt: z.string().datetime(),
  }),
});

export type ChatEventPayloads = {
  [CHAT_EVENTS.messageNew]: MessageNewPayload;
};

export type ChatEventName = keyof ChatEventPayloads;
