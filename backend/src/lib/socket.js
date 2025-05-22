// backend/lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Define the admin user ID - CONFIRMED TO BE THIS ID
const ADMIN_USER_ID = "682e7db87b82ee0c1d2a99a4";

// Configure CORS for Socket.IO
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
  if (userId) userSocketMap[userId] = socket.id; // ⭐ CRITICAL CHANGE HERE: Use socket.broadcast.emit() ⭐

  if (userId === ADMIN_USER_ID) {
    // This sends to all connected clients EXCEPT the one that just connected (the admin)
    socket.broadcast.emit("adminOnlineToast", {
      message: "Say Hi to Our Admin!",
    });
    console.log("Admin user connected. Emitting toast event to other users.");
  } // io.emit() is used to send events to all the connected clients (including the current one)

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // This correctly updates everyone's online list

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
