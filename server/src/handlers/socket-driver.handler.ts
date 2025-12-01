import { Server as SocketIOServer, Socket } from "socket.io";

import ActiveService from "../services/active.service";
import InformService from "../services/inform.service";

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

type BusNotificationSend = {
    active_id: number,
    notify_id: number,
    at: string,
    message: string,
    description: string,
    type: string
}

type DriverNotificationSend = {
    active_id: number,
    student_id: number,
    status: string,
}

type CheckinNotificationSend = {
    active_id: number,
    student_id: number,
    status: string,
}

const SocketDriver = (socket: Socket, io: SocketIOServer) => {
    socket.on("bus-location-send", async data => {
        const socketData: BusLocationSend = data;
        const response: BusLocationReceive = await ActiveService.updateFromLocationSocket(socketData);
        io.emit(`bus-location-receive/${response.id}`, response);
    });

    socket.on("bus-notification-send", async data => {
        const socketData: BusNotificationSend = data;
        console.log("Received bus-notification-send:", socketData);
        const inform = await InformService.getInformFromSocket(socketData.notify_id);
        if (!inform) {
            console.log(`Inform with ID ${socketData.notify_id} not found.`);
        }
        io.emit(`bus-notification-receive/${socketData.active_id}`, socketData);
    });

    socket.on("driver-notification-send", data => {
        const socketData: DriverNotificationSend = data;
        io.emit(`driver-notification-receive/${socketData.active_id}`, socketData);
    });

    socket.on("checkin-notification-send", data => {
        const socketData: CheckinNotificationSend = data;
        io.emit(`checkin-notification-receive/${socketData.active_id}`, socketData);
    });
}

export default SocketDriver;