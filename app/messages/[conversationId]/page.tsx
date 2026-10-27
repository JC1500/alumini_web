import { notFound, redirect } from "next/navigation";
import ConversationView from "@/components/chat/conversation-view";
import { getCurrentProfile } from "@/lib/chat/get-current-profile";
import type { ConversationHeaderDTO, MessageDTO } from "@/lib/chat/dto";
import { conversationIdSchema } from "@/lib/chat/schemas";
import {
  ChatServiceError,
  getConversation,
  getMessages,
} from "@/lib/chat/service";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  if (!conversationIdSchema.safeParse(conversationId).success) {
    notFound();
  }

  const current = await getCurrentProfile();

  if (current.status === "unauthenticated") {
    redirect("/sign-in");
  }

  if (current.status === "profile_missing") {
    notFound();
  }

  let conversation: ConversationHeaderDTO;
  let history: { items: MessageDTO[]; nextCursor: string | null };

  try {
    [conversation, history] = await Promise.all([
      getConversation(conversationId, current.profile.id),
      getMessages(current.profile.id, { conversationId, limit: 30 }),
    ]);
  } catch (error) {
    if (error instanceof ChatServiceError && error.code === "not_found") {
      notFound();
    }

    throw error;
  }

  return (
    <ConversationView
      key={conversationId}
      conversation={conversation}
      initialMessages={history.items}
      initialNextCursor={history.nextCursor}
      myProfileId={current.profile.id}
    />
  );
}
