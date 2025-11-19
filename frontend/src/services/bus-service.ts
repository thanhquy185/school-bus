import { api, type RestResponse } from "../api/api";

export const getBuses = async (): Promise<RestResponse> => {
    const response = await api.get("/api/buses");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const getBusesActive = async (): Promise<RestResponse> => {
    const response = await api.get("/api/buses/active");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const createBus = async (params: CreateParams): Promise<RestResponse> => {
    const response = await api.post("/api/buses", params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const updateBus = async (id: number, params: UpdateParams): Promise<RestResponse> => {
    const response = await api.put(`/api/buses/${id}`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

type CreateParams = {
    license_plate: string,
    capacity: number,
    status: string
}

type UpdateParams = {
    license_plate?: string,
    capacity?: number,
    status?: string
}