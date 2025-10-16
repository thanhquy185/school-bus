import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BAD_CODE, INVALID_MESSAGE } from "../configs/respose.config";
import { RestResponse } from "../responses/rest.response";

const useZod = {
    errorHandle(err: any, _req: Request, res: Response, _next: NextFunction) {
        if (err instanceof ZodError) {
            const errors = JSON.parse(err.message);
            console.log(errors);
            if (Array.isArray(errors)) {
                const errorMessage = errors.map(error => error.message);
                const response = {
                    statusCode: BAD_CODE,
                    result: false,
                    message: INVALID_MESSAGE,
                    data: null,
                    errorMessage: errorMessage
                } as RestResponse;
                return res.status(BAD_CODE).json(response);
            } else {
                const response = {
                    statusCode: BAD_CODE,
                    result: false,
                    message: INVALID_MESSAGE,
                    data: null,
                    errorMessage: "Lỗi định dạng không xác định được"
                } as RestResponse;
                return res.status(BAD_CODE).json(response);
            }
        }
        _next(err);
    }
}

export default useZod;