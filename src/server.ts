import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from "dotenv";
import { runDBConnection } from "./config";
import userRoute from './routes/user.Route';
import taskRoute from './routes/task.Route';
dotenv.config();

export const app = express();
app.use(express.json());
app.use('/api/auth', userRoute);
app.use('/api/tasks', taskRoute);

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: 'http://127.0.0.1:5500', 
        methods: ['GET','POST'],
    }
});

// web-socket connections
io.on('connection', (socket)=> {
    console.log("A client is connected: ", socket.id);

    socket.on('send-notification', (data)=> {
        console.log("Notification received: ", data);
        io.emit('receive-notification', { message: "Notification sent to client "});
    });

    socket.on("disconnect", ()=> {
        console.log(`client disconnected: ${socket.id}`)
    })
})

httpServer.listen(process.env.PORT, ()=> {
    console.log(`server is running on port: ${process.env.PORT}`);
    // runDBConnection();
})