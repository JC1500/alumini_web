
import type { Server } from "socket.io";

import { authenticateSocket } from "../auth/socket-auth";
import { handleConnection } from "./connection.handler";

export function registerSocketHandlers(io: Server) {
  // Authenticate every incoming connection
  io.use(authenticateSocket);

  // Handle successfully authenticated connections
  io.on("connection", (socket) => {
    handleConnection(io, socket);
  });
}
