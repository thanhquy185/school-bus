import express from 'express';
import cors from 'cors';
import path from "path";

import AuthMiddleware from './middlewares/auth.middleware';

import AuthRouter from './routes/auth.route';
import AccountRouter from './routes/account.route';
import PickupRouter from './routes/pickup.route';
import BusRouter from './routes/bus.route';
import ParentRouter from './routes/parent.route';


import useZod from './hooks/useZod.hook';
import usePrisma from './hooks/usePrisma.hook';
import useError from './hooks/useError.hook';

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(cors({ origin: "http://localhost:3000" }));
// Parse JSON request body
app.use(express.json()); 

app.use("/auth", AuthRouter);
app.use("/api/accounts", AuthMiddleware(["ADMIN"]).authenticate, AccountRouter);
app.use("/api/pickups", AuthMiddleware(["ADMIN"]).authenticate, PickupRouter);
app.use("/api/buses", AuthMiddleware(["ADMIN"]).authenticate, BusRouter);
app.use("/api/parents", AuthMiddleware(["ADMIN"]).authenticate, ParentRouter);


app.use(useZod.errorHandle);
app.use(usePrisma.errorHandle);
app.use(useError.errorHandle);

export default app;
