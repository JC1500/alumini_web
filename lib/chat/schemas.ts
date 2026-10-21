import { z } from "zod";

export const conversationIdSchema = z.string().min(1).max(30);

export const sendMessageInputSchema = z.object({
  conversationId: conversationIdSchema,
  clientId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000),
});

export const messageCursorSchema = z.object({
  createdAt: z.string().datetime(),
  id: z.string().min(1).max(30),
});

export const getMessagesInputSchema = z.object({
  conversationId: conversationIdSchema,
  cursor: messageCursorSchema.optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
export type MessageCursor = z.infer<typeof messageCursorSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesInputSchema>;
