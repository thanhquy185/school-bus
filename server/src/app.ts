import express from 'express';
import cors from 'cors';

import AuthMiddleware from './middlewares/auth.middleware';

import AuthRouter from './routes/auth.route';
import AccountRouter from './routes/account.route';

import useZod from './hooks/useZod.hook';
import usePrisma from './hooks/usePrisma.hook';
import useError from './hooks/useError.hook';

const app = express();

app.use(cors());
// Parse JSON request body
app.use(express.json()); 

app.use("/auth", AuthRouter);
app.use("/api/accounts", AuthMiddleware(["ADMIN"]).authenticate, AccountRouter);

app.use(useZod.errorHandle);
app.use(usePrisma.errorHandle);
app.use(useError.errorHandle);

export default app;
