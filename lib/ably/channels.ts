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

export type ChatEventPayloads = {
  [CHAT_EVENTS.messageNew]: MessageNewPayload;
};

export type ChatEventName = keyof ChatEventPayloads;
