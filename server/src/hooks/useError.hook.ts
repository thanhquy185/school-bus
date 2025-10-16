import { NextFunction, Request, Response } from "express";
import { RestResponse } from "../responses/rest.response";
import { INTERNAL_CODE, INTERNAL_MESSAGE } from "../configs/respose.config";

const useError = {
    errorHandle(err: any, _req: Request, res: Response, next: NextFunction) {
        if (err instanceof Error) {
            const response = {
                statusCode: INTERNAL_CODE,
                result: false,
                message: INTERNAL_MESSAGE,
                data: null,
                errorMessage: err.message
            } as RestResponse;
            return res.status(response.statusCode).json(response);
        } else {
            const response = {
                statusCode: INTERNAL_CODE,
                result: false,
                message: INTERNAL_MESSAGE,
                data: null,
                errorMessage: "Unknown error"
            } as RestResponse;
            return res.status(response.statusCode).json(response);
        }
    }
}

export default useError;