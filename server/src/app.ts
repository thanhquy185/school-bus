import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

import AuthMiddleware from "./middlewares/auth.middleware";

import AuthRouter from "./routes/auth.route";
import AccountRouter from "./routes/account.route";
import PickupRouter from "./routes/pickup.route";
import BusRouter from "./routes/bus.route";
import ParentRouter from "./routes/parent.route";
import StudentRouter from "./routes/student.route";
import DriverRouter from "./routes/driver.route";

import useZod from "./hooks/useZod.hook";
import usePrisma from "./hooks/usePrisma.hook";
import useError from "./hooks/useError.hook";
import UploadMiddleware from "./middlewares/upfile.middware";

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  cors({
    origin: "http://localhost:3000", // Cho phép frontend truy cập
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
// app.use(bodyParser.urlencoded({extended:false}));

app.use("/auth", AuthRouter);
app.use("/api/accounts", AuthMiddleware(["ADMIN"]).authenticate, AccountRouter);
app.use("/api/pickups", AuthMiddleware(["ADMIN"]).authenticate, PickupRouter);
app.use("/api/buses", AuthMiddleware(["ADMIN"]).authenticate, BusRouter);
app.use("/api/parents", AuthMiddleware(["ADMIN"]).authenticate, ParentRouter);
// app.use("/api/drivers", AuthMiddleware(["ADMIN"]).authenticate, DriverRouter);
app.use("/api/drivers", DriverRouter);

// Demo upload file
app.use("/api/students", StudentRouter);

app.use(useZod.errorHandle);
app.use(usePrisma.errorHandle);
app.use(useError.errorHandle);

export default app;
