import "server-only";

import * as Ably from "ably";
import type { ChatEventName, ChatEventPayloads } from "@/lib/ably/channels";
import { userChannel } from "@/lib/ably/channels";

let ablyRestClient: Ably.Rest | undefined;

export function getAblyRestClient(): Ably.Rest {
  if (ablyRestClient) {
    return ablyRestClient;
  }

  const apiKey = process.env.ABLY_API_KEY;

  if (!apiKey) {
    throw new Error("ABLY_API_KEY is not configured.");
  }

  ablyRestClient = new Ably.Rest({ key: apiKey });
  return ablyRestClient;
}

export async function publishToUser<Event extends ChatEventName>(
  profileId: string,
  event: Event,
  data: ChatEventPayloads[Event],
): Promise<void> {
  try {
    await getAblyRestClient()
      .channels.get(userChannel(profileId))
      .publish(event, data);
  } catch (error) {
    console.error(`Failed to publish Ably event "${event}".`, error);
  }
}
