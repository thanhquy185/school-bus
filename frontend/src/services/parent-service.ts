import { api, type RestResponse } from "../api/api";

export const getParents = async (): Promise<RestResponse> => {
    const response = await api.get("/api/parents");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const getParentsActive = async (): Promise<RestResponse> => {
    const response = await api.get("/api/parents/all-active");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const uploadParentAvatar = async (id: number, params: FormData): Promise<RestResponse> => {
    const response = await api.post(`/api/parents/${id}/avatar`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const createParent = async (params: CreateParams): Promise<RestResponse> => {
    const response = await api.post("/api/parents", params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const updateParent = async (id: number, params: UpdateParams): Promise<RestResponse> => {
    const response = await api.put(`/api/parents/${id}`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const getActiveByStudent = async (id: number): Promise<RestResponse> => {
    const response = await api.get(`/api/parents/active-by-student/${id}`);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const getStudents = async (): Promise<RestResponse> => {
    const response = await api.get("/api/parents/students");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const getInfo = async (): Promise<RestResponse> => {
    const response = await api.get("/api/parents/info");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

type CreateParams = {
    full_name: string,
    phone: string,
    email: string,
    address: string,
    username: string,
    password: string,
    status: string
}

type UpdateParams = {
    full_name?: string,
    phone?: string,
    email?: string,
    address?: string,
    password?: string,
    status?: string
}