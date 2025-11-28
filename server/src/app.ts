import express, { Request, Response } from 'express';
import cors from 'cors';
import path from "path";
// import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';

import AuthMiddleware from './middlewares/auth.middleware';

import AuthRouter from './routes/auth.route';
import AccountRouter from './routes/account.route';
import ActiveRouter from './routes/active.route';
import ActivePickupRouter from './routes/active-pickup.route';
import ActiveStudentRouter from './routes/active-student.route';
import InformRouter from './routes/inform.route';
import ScheduleRouter from './routes/schedule.route';
import RouteRouter from './routes/route.route';
import PickupRouter from './routes/pickup.route';
import BusRouter from './routes/bus.route';
import ParentRouter from './routes/parent.route';
import StudentRouter from './routes/student.route';
import ClassRouter from './routes/class.route';
import DriverRouter from './routes/driver.route';

import useZod from './hooks/useZod.hook';
import usePrisma from './hooks/usePrisma.hook';
import useError from './hooks/useError.hook';

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Socket.IO setup
const socketServer = createServer(app);
const socketIO = new SocketIOServer(socketServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

if (socketIO) {
    console.log("Socket.IO server initialized");
}

socketIO.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("bus-location-send", (data) => {
        console.log("Bus location update:", data);
        // Gửi đến TẤT CẢ clients (bao gồm cả client gửi)
        socketIO.emit("bus-location-receive", data);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// API routes
app.use("/auth", AuthRouter);
// app.use("/api/accounts", AuthMiddleware(["ADMIN"]).authenticate, AccountRouter);
app.use("/api/accounts", AccountRouter);
app.use("/api/actives", ActiveRouter);
app.use("/api/active-pickups", ActivePickupRouter);
app.use("/api/active-students", ActiveStudentRouter);
app.use("/api/informs", InformRouter);
app.use("/api/schedules", ScheduleRouter);
app.use("/api/buses", BusRouter);
app.use("/api/routes", RouteRouter);
app.use("/api/pickups", PickupRouter);
app.use("/api/parents", ParentRouter);
app.use("/api/classes", ClassRouter);
app.use("/api/students", StudentRouter);

app.use("/api/drivers", DriverRouter);

app.get("/api/hello-world", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hello quy map"
    })
})

// Error handling middleware
app.use(useZod.errorHandle);
app.use(usePrisma.errorHandle);
app.use(useError.errorHandle);

export default app;
export { socketServer, socketIO };
