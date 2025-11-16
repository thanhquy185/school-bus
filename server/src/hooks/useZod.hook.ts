import e, { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BAD_CODE, INVALID_MESSAGE } from "../configs/respose.config";
import { RestResponse } from "../responses/rest.response";

const useZod = {
    errorHandle(err: any, _req: Request, res: Response, _next: NextFunction) {
        if (err instanceof ZodError) {
            const errors = JSON.parse(err.message);
            console.log("Zod Errors:", errors);

            if (Array.isArray(errors)) {
                const errorMessage = errors.map(error => {
                    const message: string = error.message;
                    const path: string[] = error.path;

                    if (message.includes("received undefined")) {
                        if (path[0] === "email") return "Yêu cầu nhập email";
                        if (path[0] === "phone") return "Yêu cầu nhập số điện thoại";
                        if (path[0] === "username") return "Yêu cầu nhập tài khoản";
                        if (path[0] === "password") return "Yêu cầu nhập mật khẩu";
                        if (path[0] === "address") return "Yêu cầu nhập địa chỉ";
                    }

                    return error.message;
                });
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