"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function SocketConnectionTest() {
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    let socket: Socket | null = null;
    let cancelled = false;

    async function connectSocket() {
      try {
        // Get a short-lived token from Next.js
        const response = await fetch("/api/socket-token", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Token request failed: ${response.status}`
          );
        }

        const { token } = await response.json();

        if (cancelled) return;

        // Connect to the separate Socket.IO server
        socket = io(
          process.env.NEXT_PUBLIC_SOCKET_URL!,
          {
            auth: {
              token,
            },
          }
        );

        socket.on("connect", () => {
          setStatus(`Connected! Socket ID: ${socket?.id}`);
        });

        socket.on("connect_error", (error) => {
          setStatus(`Connection failed: ${error.message}`);
          console.error("Socket connection error:", error);
        });

        socket.on("disconnect", (reason) => {
          setStatus(`Disconnected: ${reason}`);
        });
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setStatus(
            error instanceof Error
              ? error.message
              : "Connection failed"
          );
        }
      }
    }

    connectSocket();

    return () => {
      cancelled = true;
      socket?.disconnect();
    };
  }, []);

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="font-semibold">
        Socket.IO Connection Test
      </h2>

      <p className="mt-2">{status}</p>
    </div>
  );
}