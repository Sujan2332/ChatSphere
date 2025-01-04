const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const invitationRoutes = require("./routes/invitation.routes");

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
    "http://localhost:5173",
    "https://chatsphere-oepd.onrender.com"
];

// Configure CORS
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    },
});

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => {
        console.error("MongoDB Connection Failed:", err.message);
        process.exit(1);
    });
console.log(process.env.MONGO_URI);

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/invitation", invitationRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: "Route Not Found." });
});

io.on('connection', (socket) => {
    console.log("A User Connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
        try {
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.join(roomId);
        } catch (error) {
            console.error(`Error joining room ${roomId}:`, error.message);
        }
    });

    socket.on("sendMessage", (message) => {
        try {
            const { roomId, content, sender } = message;
            io.to(roomId).emit("receiveMessage", { content, sender, time: new Date() });
            console.log(`Message sent to room ${roomId}`, content);
        } catch (error) {
            console.error(`Error sending message to room ${roomId}:`, error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server is Running on PORT ${PORT}`));
