import { NextFunction, Request, Response } from "express";
import { INTERNAL_CODE, INTERNAL_MESSAGE } from "../configs/respose.config";
import { RestResponse } from "../responses/rest.response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const usePrisma = {
    errorHandle(err: any, _req: Request, res: Response, next: NextFunction) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                const response = {
                    statusCode: INTERNAL_CODE,
                    result: false,
                    message: INTERNAL_MESSAGE,
                    data: null,
                    errorMessage: "Dữ liệu đã tồn tại"
                } as RestResponse;
                return res.status(INTERNAL_CODE).json(response);
            }

            else if (err.code === 'P2025') {
                const response = {
                    statusCode: INTERNAL_CODE,
                    result: false,
                    message: INTERNAL_MESSAGE,
                    data: null,
                    errorMessage: "Dữ liệu không tồn tại"
                } as RestResponse;
                return res.status(INTERNAL_CODE).json(response);
            }
        }
        next(err);
    }

}

export default usePrisma;