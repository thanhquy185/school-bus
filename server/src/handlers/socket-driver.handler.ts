import { Server as SocketIOServer, Socket } from "socket.io";

import ActiveService from "../services/active.service";

type BusLocationSend = {
    id: number,
    bus_lat: number,
    bus_lng: number,
    bus_speed: number,
    bus_status: string
}

type BusLocationReceive = {
    id: number,
    bus_lat: number,
    bus_lng: number,
    bus_speed: number,
    bus_status: string
}

const SocketDriver = (socket: Socket, io: SocketIOServer) => {
    socket.on("bus-location-send", async data => {
        const socketData: BusLocationSend = data;
        const response: BusLocationReceive = await ActiveService.updateFromLocationSocket(socketData);
        // console.log("Get data by update bus location: ", response)

        // Cách 1: Gửi về chỉ client hiện tại (driver app)
        // socket.emit(`bus-location-receive/${response.id}`, response);
        
        // Cách 2: Broadcast đến TẤT CẢ clients (parent apps, admin dashboard)
        // Để parent có thể real-time theo dõi vị trí xe bus
        io.emit(`bus-location-receive/${response.id}`, response);
        
        // Cách 3 (Optional): Gửi đến room cụ thể (chỉ parent theo dõi bus này)
        // io.to(`bus-${response.id}`).emit("bus-location-receive", response);
    });

    socket.on("bus-notification-send", async data => {
        // TODO: Implement notification logic
    });
}

export default SocketDriver;