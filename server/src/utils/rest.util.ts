import { BAD_MESSAGE, CREATED_CODE, SUCCESS_CODE, SUCCESS_MESSAGE } from "../configs/respose.config";
import { RestResponse } from "../responses/rest.response";

/**
 * Valid Get Rest Response
 * @param data - Check data
 * @returns RestResponse
 */
export const isGetRest = (data: any): RestResponse => {
    return {
        statusCode: data ? SUCCESS_CODE : 400,
        result: data ? true : false,
        message: data ? SUCCESS_MESSAGE : BAD_MESSAGE,
        data: data ? data : null,
        errorMessage: data ? null : "Lấy dữ liệu không thành công"
    } as RestResponse;
}

/**
 * Valid Create Rest Response
 * @param data - Check data
 * @returns RestResponse
 */
export const isCreateRest = (data: any): RestResponse => {
    return {
        statusCode: data ? CREATED_CODE : 400,
        result: data ? true : false,
        message: data ? SUCCESS_MESSAGE : BAD_MESSAGE,
        data: data ? data : null,
        errorMessage: data ? null : "Tạo dữ liệu không thành công"
    } as RestResponse;
}

/**
 * Valid Put Rest Response
 * @param data - Check data
 * @returns RestResponse
 */
export const isPutRest = (data: any): RestResponse => {
    return {
        statusCode: data ? SUCCESS_CODE : 400,
        message: data ? SUCCESS_MESSAGE : BAD_MESSAGE,
        data: data ? data : null,
        errorMessage: data ? null : "Cập nhật dữ liệu không thành công"
    } as RestResponse;
}

/**
 * Valid Delete Rest Response
 * @param data - Check data
 * @returns RestResponse
 */
export const isDeleteRest = (data: any): RestResponse => {
    return {
        statusCode: data ? SUCCESS_CODE : 400,
        message: data ? SUCCESS_MESSAGE : BAD_MESSAGE,
        data: data ? data : null,
        errorMessage: data ? null : "Xóa dữ liệu không thành công"
    } as RestResponse;
}
