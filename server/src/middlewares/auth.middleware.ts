import { NextFunction, Request, Response } from "express";
import { RestResponse } from "../responses/rest.response";
import { FORBIDDEN, FORBIDDEN_MESSAGE, UNAUTHORIZED, UNAUTHORIZED_MESSAGE } from "../configs/respose.config";
import { verifyToken } from "../utils/jwt.util";

const AuthMiddleware = (roles: string[]) => {
    return {
        async authenticate(_req: Request, res: Response, next: NextFunction) {
            try {
                const bearerToken = _req.headers.authorization;
                if (!bearerToken) {
                    const response = {
                        statusCode: UNAUTHORIZED,
                        result: false,
                        message: UNAUTHORIZED_MESSAGE,
                        data: null,
                        errorMessage: null
                    } as RestResponse;
                    res.status(response.statusCode).json(response);
                } else {
                    const token = bearerToken.split(" ")[1];
                    const payload: { id: number, username: string, role: string, iat: number, exp: number } = await verifyToken(token);
                    if (!roles.includes(payload.role)) {
                        const response = {
                            statusCode: FORBIDDEN,
                            result: false,
                            message: FORBIDDEN_MESSAGE,
                            data: null,
                            errorMessage: null
                        } as RestResponse;
                        res.status(response.statusCode).json(response);
                    }
                }
            } catch (error: any) {
                next(error);
            } finally {
                next();
            }
        }
    }
}

export default AuthMiddleware;