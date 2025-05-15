require('dotenv').config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const userRoute = require("./Routes/userRoutes");
const chatRoute = require("./Routes/chatRoutes");
const messageRoute = require("./Routes/messageRoutes");

const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URL;

const app = express();
app.use(express.json());

// CORS setup for both development and production
app.use(cors({
<<<<<<< HEAD
  origin: [ "https://app-chat-iota-puce.vercel.app", "http://localhost:5173"],
  credentials: true,
=======
  origin: 'https://app-chat-iota-puce.vercel.app', 
  credentials: true, 
>>>>>>> 899d61fc90cf4dab0b47a0d00efbddbee155a7d0
}));

// API routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Test routes
app.get('/', (req, res) => {
  res.send("Server is up & running");
});

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["https://app-chat-iota-puce.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("✅ New socket connected:", socket.id);

  // Add user
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some(user => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  // Send message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(user => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date()
      });
    }
    console.log("📩 Message sent:", message);
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// MongoDB connect
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => console.log("❌ MongoDB connection failed:", error.message));

// Start server
server.listen(port, () => {
  console.log(`🚀 Server + Socket.IO running on port ${port}`);
});
