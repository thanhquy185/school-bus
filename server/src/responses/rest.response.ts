export type RestResponse = {
    statusCode: number,
    result: boolean,
    message: string,
    data: any,
    errorMessage: string | string[]
}