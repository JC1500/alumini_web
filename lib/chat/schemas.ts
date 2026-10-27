import { z } from "zod";

export const conversationIdSchema = z.string().regex(/^c[a-z0-9]{24}$/);
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,30}$/);
export const cursorTokenSchema = z.string().min(1).max(512);

export const sendMessageInputSchema = z.object({
  conversationId: conversationIdSchema,
  clientId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000),
});

export const messageCursorSchema = z.object({
  createdAt: z.string().datetime(),
  id: conversationIdSchema,
});

export const getMessagesInputSchema = z.object({
  conversationId: conversationIdSchema,
  cursor: cursorTokenSchema.optional(),
  limit: z.coerce.number().int().positive().max(1000).optional(),
  after: cursorTokenSchema.optional(),
}).refine((input) => !(input.cursor && input.after));

export const findOrCreateConversationInputSchema = z.object({
  username: usernameSchema,
});

export const markReadInputSchema = z.object({
  conversationId: conversationIdSchema,
});

export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
export type MessageCursor = z.infer<typeof messageCursorSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesInputSchema>;
export type FindOrCreateConversationInput = z.infer<
  typeof findOrCreateConversationInputSchema
>;
export type MarkReadInput = z.infer<typeof markReadInputSchema>;
