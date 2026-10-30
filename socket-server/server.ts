import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets";
import { prisma } from "./prisma";
import app from './app';

const PORT = Number(process.env.SOCKET_PORT ?? 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

if (!FRONTEND_ORIGIN) {
  throw new Error("FRONTEND_ORIGIN is not configured");
}

const httpserver=createServer(app);

const io=new Server(httpserver,{
  cors:{
    origin:FRONTEND_ORIGIN,
    methods:["GET","POST"],
    credentials:true,
  },
});

registerSocketHandlers(io);

httpserver.listen(PORT,()=>{
  console.log("Server started at port ",PORT);
})

async function shutdown() {
  console.log("Shutting down server...");

  io.close();

  await prisma.$disconnect();

  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
