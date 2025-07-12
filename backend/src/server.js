import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import chatRoutes from './routes/chat.route.js';
import notificationsRoutes from "./routes/notifications.route.js";
import { Server } from 'socket.io';
import http from 'http';
import Chat from './models/chat.model.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL, // e.g., "http://localhost:5173"
        credentials: true,
    },
});

// ✅ Your Socket.io logic here
io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`✅ User joined room: ${roomId}`);
    });

    socket.on("sendMessage", (data) => {
        const { roomId, message, senderId, receiverId, timestamp } = data;

        const newMessage = {
            senderId,
            receiverId,
            message,
            timestamp: timestamp || new Date().toISOString(),
        };

        // Broadcast to everyone in the room except the sender
        socket.to(roomId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});
// ======== Middlewares ========
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ======== Routes ========
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);
app.use("/api/notifications", notificationsRoutes);

// ======== Connect DB ========
connectDB();

// ======== Start Server ========
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
