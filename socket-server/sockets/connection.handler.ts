
import type { Server, Socket } from "socket.io";

export function handleConnection(
  io: Server,
  socket: Socket,
) {
  const userId = socket.data.userId;

  console.log(`User connected: ${userId}`);

  socket.on("disconnect", (reason) => {
    console.log(
      `User disconnected: ${userId}`,
      reason,
    );
  });
}
