import { Server } from "socket.io";
import http from "http";
import express from "express";

const ADMIN_USER_ID = "682e7db87b82ee0c1d2a99a4";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  if (userId === ADMIN_USER_ID) {
    // Emit to all connected clients (excluding the admin themselves if desired, but here we emit to all)
    io.emit("adminOnlineToast", { message: "Say Hi to Our Admin!" });
    console.log("Admin user connected. Emitting toast event.");
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
