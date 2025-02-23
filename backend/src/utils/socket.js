import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        credentials: true,
    },
});

export function getRecievedSocketId(userId) {
    return userSocket[userId];
}

const userSocket = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocket[userId] = socket.id;
        console.log(`User ${userId} is now online.`);
    }

    // Emit the updated online users list
    io.emit('onlineUsers', Object.keys(userSocket)); 

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Ensure userId exists before deleting
        if (userId) {
            delete userSocket[userId];
            console.log(`User ${userId} is now offline.`);
        }

        // Emit updated list after a user disconnects
        io.emit('onlineUsers', Object.keys(userSocket));
        console.log('Current online users:', userSocket);
    });
});

export { io, server, app };
