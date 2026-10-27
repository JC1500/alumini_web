import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { config as loadEnv } from "dotenv";

if (!process.argv.includes("--yes")) {
  throw new Error("Refusing to run without the --yes flag.");
}

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

if (process.env.NODE_ENV === "production") {
  throw new Error("Refusing to run when NODE_ENV is production.");
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const databaseTarget = new URL(databaseUrl);
console.log(
  `Database target: host=${databaseTarget.hostname}; database=${databaseTarget.pathname.slice(1)}`,
);

const profileAId = process.env.CHAT_TEST_PROFILE_A;
const profileBId = process.env.CHAT_TEST_PROFILE_B;
const profileCId = process.env.CHAT_TEST_PROFILE_C;

if (!profileAId || !profileBId || !profileCId) {
  throw new Error(
    "Set CHAT_TEST_PROFILE_A, CHAT_TEST_PROFILE_B, and CHAT_TEST_PROFILE_C.",
  );
}

if (
  profileAId === profileBId ||
  profileAId === profileCId ||
  profileBId === profileCId
) {
  throw new Error("The three chat smoke-test profile IDs must be distinct.");
}

const { prisma } = await import("../lib/prisma");
const {
  ChatServiceError,
  findOrCreateConversation,
  getInbox,
  getMessages,
  markRead,
  sendMessage,
} = await import("../lib/chat/service");

let conversationId: string | undefined;
let conversationWasCreated = false;

function assertServiceError(
  action: () => Promise<unknown>,
  expectedCode: string,
) {
  return action().then(
    () => {
      throw new Error(`Expected service error "${expectedCode}".`);
    },
    (error: unknown) => {
      assert.ok(error instanceof ChatServiceError);
      assert.equal(error.code, expectedCode);
    },
  );
}

try {
  const [profileA, profileB, profileC] = await Promise.all([
    prisma.alumniProfile.findUnique({
      where: { id: profileAId },
      select: { id: true, username: true },
    }),
    prisma.alumniProfile.findUnique({
      where: { id: profileBId },
      select: { id: true, username: true },
    }),
    prisma.alumniProfile.findUnique({
      where: { id: profileCId },
      select: { id: true },
    }),
  ]);

  assert.ok(profileA, "Profile A does not exist.");
  assert.ok(profileB, "Profile B does not exist.");
  assert.ok(profileC, "Profile C does not exist.");

  const [participantAId, participantBId] =
    profileAId < profileBId
      ? [profileAId, profileBId]
      : [profileBId, profileAId];
  const existingPair = await prisma.conversation.findUnique({
    where: {
      participantAId_participantBId: { participantAId, participantBId },
    },
    select: { id: true },
  });

  assert.equal(
    existingPair,
    null,
    "A/B already have a conversation; refusing to modify existing chat data.",
  );

  const created = await findOrCreateConversation(profileAId, profileB.username);
  conversationId = created.conversationId;
  conversationWasCreated = true;

  const repeated = await findOrCreateConversation(
    profileAId,
    profileB.username,
  );
  assert.equal(repeated.conversationId, conversationId);

  await assertServiceError(
    () => findOrCreateConversation(profileAId, profileA.username),
    "invalid_input",
  );

  await markRead(profileAId, conversationId);
  await markRead(profileBId, conversationId);

  const firstClientId = randomUUID();
  const firstMessage = await sendMessage(profileAId, {
    conversationId,
    clientId: firstClientId,
    body: "Chat smoke-test message 0",
  });
  const repeatedMessage = await sendMessage(profileAId, {
    conversationId,
    clientId: firstClientId,
    body: "Chat smoke-test message 0",
  });
  assert.equal(repeatedMessage.id, firstMessage.id);

  for (let index = 1; index < 65; index++) {
    const clientId = randomUUID();
    await sendMessage(profileAId, {
      conversationId,
      clientId,
      body: `Chat smoke-test message ${index}`,
    });
  }

  const pagination = await getMessages(profileAId, {
    conversationId,
    limit: 30,
  });
  const pagedMessages = [...pagination.items];
  let nextCursor = pagination.nextCursor;

  while (nextCursor) {
    const page = await getMessages(profileAId, {
      conversationId,
      cursor: nextCursor,
      limit: 30,
    });
    pagedMessages.unshift(...page.items);
    nextCursor = page.nextCursor;
  }

  const databaseMessages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  assert.deepEqual(
    pagedMessages.map((message) => message.id),
    databaseMessages.map((message) => message.id),
  );
  assert.equal(new Set(pagedMessages.map((message) => message.id)).size, 65);

  const invalidCursor = await getMessages(profileAId, {
    conversationId,
    cursor: "not-a-valid-cursor",
  }).then(
    () => null,
    (error: unknown) => error,
  );
  assert.ok(invalidCursor instanceof ChatServiceError);
  assert.equal(invalidCursor.code, "invalid_input");

  const lastA = pagedMessages[pagedMessages.length - 1];
  const catchUpClientId = randomUUID();
  await sendMessage(profileBId, {
    conversationId,
    clientId: catchUpClientId,
    body: "Chat smoke-test catch-up message",
  });

  const catchUp = await getMessages(profileAId, {
    conversationId,
    after: Buffer.from(
      JSON.stringify({ createdAt: lastA.createdAt, id: lastA.id }),
    ).toString("base64url"),
    limit: 100,
  });
  assert.equal(catchUp.items.length, 1);
  assert.equal(catchUp.items[0].clientId, catchUpClientId);
  assert.equal(catchUp.nextCursor, null);

  const inboxA = await getInbox(profileAId);
  const inboxB = await getInbox(profileBId);
  assert.equal(
    inboxA.find((item) => item.conversationId === conversationId)?.unreadCount,
    1,
  );
  assert.equal(
    inboxB.find((item) => item.conversationId === conversationId)?.unreadCount,
    65,
  );

  await assertServiceError(
    () =>
      sendMessage(profileCId, {
        conversationId: conversationId!,
        clientId: randomUUID(),
        body: "Outsider test",
      }),
    "not_found",
  );
  await assertServiceError(
    () => getMessages(profileCId, { conversationId: conversationId! }),
    "not_found",
  );
  await assertServiceError(
    () => markRead(profileCId, conversationId!),
    "not_found",
  );

  await markRead(profileAId, conversationId);
  const readInboxA = await getInbox(profileAId);
  assert.equal(
    readInboxA.find((item) => item.conversationId === conversationId)
      ?.unreadCount,
    0,
  );

  await markRead(profileBId, conversationId);
  const readInboxB = await getInbox(profileBId);
  assert.equal(
    readInboxB.find((item) => item.conversationId === conversationId)
      ?.unreadCount,
    0,
  );

  console.log("Chat smoke test passed.");
} finally {
  try {
    if (conversationId && conversationWasCreated) {
      const [participantAId, participantBId] =
        profileAId < profileBId
          ? [profileAId, profileBId]
          : [profileBId, profileAId];

      await prisma.conversation.deleteMany({
        where: {
          id: conversationId,
          participantAId,
          participantBId,
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}
