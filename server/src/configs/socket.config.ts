import { Server as SocketIOServer } from 'socket.io';
import { Http2Server } from 'http2';

const InitSocketIO = (socketServer: any): SocketIOServer => {
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

    const socketIO = new SocketIOServer(socketServer, {
        cors: {
            origin: CLIENT_URL,
            methods: ["GET", "POST"]
        }
    });

    if (socketIO) {
        console.log("Socket.IO server initialized");
    }

    return socketIO;
}

export default InitSocketIO;