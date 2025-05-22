// backend/lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Define the admin user ID
const ADMIN_USER_ID = "682e7db87b82ee0c1d2a99a4"; // ⭐ Your Admin's User ID ⭐

// Configure CORS for Socket.IO
// This is crucial for deployment to Render!
const SOCKET_IO_ORIGIN =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL // You will set FRONTEND_URL in Render env vars
    : "http://localhost:5173"; // For local development

const io = new Server(server, {
  cors: {
    origin: SOCKET_IO_ORIGIN, // Use the dynamic origin
    methods: ["GET", "POST"], // Explicitly allow methods
    credentials: true,
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

  // ⭐ NEW: Check if the connected user is the admin and emit a toast event ⭐
  if (userId === ADMIN_USER_ID) {
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
