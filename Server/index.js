const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const cors = require('cors')
const {createServer} = require("http")
const {Server} = require("socket.io")

const userRoutes = require("./routes/user.routes")
const chatRoutes = require("./routes/chat.routes")
const invitationRoutes = require("./routes/invitation.routes")

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,{
    cors: {
        origin : "*",
        methods:['GET', 'POST']
    }
})

app.use(express.json())
app.use(cors())

mongoose
.connect(process.env.MONGO_URI, {useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('MongoDB Connected Successfully'))
.catch((err)=>{
    console.error("MongoDB Connection Failed:",err.message)
    process.exit(1)
})
console.log(process.env.MONGO_URI);

app.use("/api/users",userRoutes)
app.use("/api/chats",chatRoutes)
app.use("/api/invitation",invitationRoutes)

app.use((req,res,next) =>{
    res.status(404).json({message:"Route Not Found."})
})

io.on('connection',(socket) =>{
    console.log("A User Connected:",socket.id)

    socket.on("joinRoom", (roomId) =>{
        console.log(`User ${socket.id} joined room ${roomId}`)
        socket.join(roomId);
    })

    socket.on("sendMessage",(message) =>{
        const {roomId, content, sender} = message
        io.to(roomId).emit("receiveMessage",{content, sender, time:new Date()})
        console.log(`Message sent to room ${roomId}`,content)
    })

    socket.on('disconnect',()=>{
        console.log("User Disconnected: ",socket.id)
    })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, ()=> console.log(`Server is Running on PORT ${PORT}`))

// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require("dotenv");
// const cors = require('cors');

// const userRoutes = require("./routes/user.routes");
// const chatRoutes = require("./routes/chat.routes");
// const invitationRoutes = require("./routes/invitation.routes");

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// mongoose
//     .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB Connected Successfully'))
//     .catch((err) => {
//         console.error("MongoDB Connection Failed:", err.message);
//         process.exit(1);
//     });

// app.use("/api/users", userRoutes);
// app.use("/api/chats", chatRoutes);
// app.use("/api/invitation", invitationRoutes);

// app.use((req, res, next) => {
//     res.status(404).json({ message: "Route Not Found." });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server is Running on PORT ${PORT}`));
