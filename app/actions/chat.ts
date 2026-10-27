"use server";

import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/chat/get-current-profile";
import {
  findOrCreateConversationInputSchema,
  getMessagesInputSchema,
  markReadInputSchema,
  sendMessageInputSchema,
} from "@/lib/chat/schemas";
import type {
  ConversationDTO,
  InboxItemDTO,
  MessageDTO,
} from "@/lib/chat/dto";
import {
  ChatServiceError,
  findOrCreateConversation as findOrCreateConversationService,
  getInbox as getInboxService,
  getMessages as getMessagesService,
  markRead as markReadService,
  sendMessage as sendMessageService,
} from "@/lib/chat/service";

export type ActionError =
  | "unauthorized"
  | "no_profile"
  | "invalid_input"
  | "not_found"
  | "rate_limited"
  | "server_error";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError };

async function resolveProfile():
  Promise<
    | { ok: true; profileId: string }
    | { ok: false; error: "unauthorized" | "no_profile" }
  > {
  const result = await getCurrentProfile();

  if (result.status === "unauthenticated") {
    return { ok: false, error: "unauthorized" };
  }

  if (result.status === "profile_missing") {
    return { ok: false, error: "no_profile" };
  }

  return { ok: true, profileId: result.profile.id };
}

function actionError<T>(error: unknown): ActionResult<T> {
  if (error instanceof ChatServiceError) {
    return { ok: false, error: error.code };
  }

  console.error("Chat action failed:", error);
  return { ok: false, error: "server_error" };
}

export async function findOrCreateConversation(
  input: unknown,
): Promise<ActionResult<ConversationDTO>> {
  try {
    const current = await resolveProfile();

    if (!current.ok) {
      return current;
    }

    const parsed = findOrCreateConversationInputSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: "invalid_input" };
    }

    return {
      ok: true,
      data: await findOrCreateConversationService(
        current.profileId,
        parsed.data.username,
      ),
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function startConversation(
  username: string,
  formData: FormData,
): Promise<void> {
  void formData;
  const parsed = findOrCreateConversationInputSchema.safeParse({ username });

  if (!parsed.success) {
    redirect("/search");
  }

  const current = await resolveProfile();

  if (!current.ok) {
    redirect(current.error === "unauthorized" ? "/sign-in" : "/me");
  }

  let conversationId: string | null = null;
  let failure: string | null = null;

  try {
    const conversation = await findOrCreateConversationService(
      current.profileId,
      parsed.data.username,
    );
    conversationId = conversation.conversationId;
  } catch (error) {
    if (error instanceof ChatServiceError) {
      failure =
        error.code === "not_found"
          ? "not_found"
          : error.code === "invalid_input"
            ? "invalid_input"
            : "server_error";
    } else {
      console.error("Starting chat conversation failed:", error);
      failure = "server_error";
    }
  }

  if (conversationId) {
    redirect(`/messages/${conversationId}`);
  }

  redirect(
    `/u/${encodeURIComponent(parsed.data.username)}?messageError=${failure ?? "server_error"}`,
  );
}

export async function sendMessage(
  input: unknown,
): Promise<ActionResult<MessageDTO>> {
  try {
    const current = await resolveProfile();

    if (!current.ok) {
      return current;
    }

    const parsed = sendMessageInputSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: "invalid_input" };
    }

    return {
      ok: true,
      data: await sendMessageService(current.profileId, parsed.data),
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function getMessages(
  input: unknown,
): Promise<ActionResult<{ items: MessageDTO[]; nextCursor: string | null }>> {
  try {
    const current = await resolveProfile();

    if (!current.ok) {
      return current;
    }

    const parsed = getMessagesInputSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: "invalid_input" };
    }

    return {
      ok: true,
      data: await getMessagesService(current.profileId, parsed.data),
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function markRead(
  input: unknown,
): Promise<ActionResult<{ unread: 0 }>> {
  try {
    const current = await resolveProfile();

    if (!current.ok) {
      return current;
    }

    const parsed = markReadInputSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: "invalid_input" };
    }

    return {
      ok: true,
      data: await markReadService(
        current.profileId,
        parsed.data.conversationId,
      ),
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function getInbox(): Promise<ActionResult<InboxItemDTO[]>> {
  try {
    const current = await resolveProfile();

    if (!current.ok) {
      return current;
    }

    return {
      ok: true,
      data: await getInboxService(current.profileId),
    };
  } catch (error) {
    return actionError(error);
  }
}
