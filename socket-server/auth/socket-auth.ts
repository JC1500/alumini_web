import { jwtVerify } from "jose";
import type { Socket } from "socket.io";
import {prisma} from '../prisma';

const secret = process.env.SOCKET_AUTH_SECRET;

if (!secret) {
  throw new Error("SOCKET_AUTH_SECRET is not configured");
}

const secretKey = new TextEncoder().encode(secret);

export async function authenticateSocket(
  socket: Socket,
  next: (err?: Error) => void,
){
    try {
        const token = socket.handshake.auth?.token;

        if (typeof token !== "string" || !token) {
            return next(new Error("Authentication required"));
        }
        const {payload}=await jwtVerify(token,secretKey,{
            algorithms:['HS256'],
        });
        const userId = payload.sub;
        const sessionId = payload.sessionId;
        if (
            typeof userId !== "string" ||
            typeof sessionId !== "string"
            ) {
                return next(new Error("Invalid authentication token"));
            }
        
        const session = await prisma.session.findFirst({
            where: {
                id: sessionId,
                userId,
                expiresAt: {
                gt: new Date(),
                },
                user: {
                status: "ACTIVE",
                },
            },
            select: {
                id: true,
                userId: true,
            },
            });
        
        if (!session) {
            return next(new Error("Session expired or revoked"));
        }
        // Attach verified identity to the socket.
        socket.data.userId=session.userId;
        socket.data.sessionId = session.id;
        next();
    }catch{
        next(new Error("Socket authentication failed"));
    }
}