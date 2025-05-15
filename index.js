



require('dotenv').config(); // सबसे पहले dotenv config

const express = require("express");
const cors = require('cors');
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

// CORS setup for frontend URL
app.use(cors({
  origin: 'https://app-chat-iota-puce.vercel.app', 
  credentials: true, 
}));

// API routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Simple test routes
app.get('/', (req, res) => {
  res.send("home");
  console.log('home route');
});

app.get('/page', (req, res) => {
  res.send("page");
  console.log('page route');
});

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize socket.io server with CORS allowed
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = [];

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some(user => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id
      });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(user => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit('getMessage', message);
      io.to(user.socketId).emit('getNotification', {
        senderId: message.senderId,
        isRead: false,
        date: new Date()
      });
    }
    console.log("sendMessage event:", message);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("Socket disconnected:", socket.id);
  });
});

// Start server with socket.io support
server.listen(port, () => {
  console.log(`Server + Socket.IO running on port ${port}`);
});

// Connect to MongoDB
mongoose.connect(uri, {
  // new parser options are default in mongoose 6+
})
.then(() => console.log('MongoDB connection established'))
.catch((error) => console.log('MongoDB connection failed:', error.message));
