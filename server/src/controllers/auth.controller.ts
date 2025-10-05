import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";
import { apiResponse } from "../utils/apiResponse";


export const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return apiResponse(res, 201, 'Register successfull', result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return apiResponse(res, 200, 'Login successfull', result);
})