import { Request, Response } from "express";
import AuthService from "../services/auth.service";

const AuthController = {
    async login(_req: Request, res: Response) {
        const response = await AuthService.login(_req.body);
        res.status(response.statusCode).json(response);
    }
}

export default AuthController;