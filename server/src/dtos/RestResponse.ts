export type RestResponse<T> = {
    statusCode: number,
    message: string,
    data: T,
    errorMessage: object 
    result: boolean
}