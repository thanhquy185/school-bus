import { api, type RestResponse } from "../api/api";

export const getDrivers = async (): Promise<RestResponse> => {
    const response = await api.get("/api/drivers");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const getByAccount = async (): Promise<RestResponse> => {
    const response = await api.get("/api/drivers/account");
    const restResponse: RestResponse = response.data;

    return restResponse;
}

export const createDriver = async (params: CreateParams): Promise<RestResponse> => {
    const response = await api.post("/api/drivers", params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const updateDriver = async (id: number, params: UpdateParams): Promise<RestResponse> => {
    const response = await api.put(`/api/drivers/${id}`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const uploadDriverAvatar = async (id: number, params: FormData): Promise<RestResponse> => {
    const response = await api.post(`/api/drivers/${id}/avatar`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

type CreateParams = {
    fullName: string,
    birthDate: string,
    gender: string,
    address: string,
    phone: string,

    email: string,
    username: string,
    password: string,
    status: string
}

type UpdateParams = {
    fullName?: string,
    birthDate?: string,
    gender?: string,
    address?: string,
    phone?: string,
    email?: string,

    password?: string,
    status?: string
}