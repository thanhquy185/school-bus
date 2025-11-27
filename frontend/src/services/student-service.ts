import { api, type RestResponse } from "../api/api";

export const getStudents = async (): Promise<RestResponse> => {
    const response = await api.get("/api/students");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const getStudentsActive = async (): Promise<RestResponse> => {
    const response = await api.get("/api/students/all-active");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const createStudent = async (params: CreateParams): Promise<RestResponse> => {
    const response = await api.post("/api/students", params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const uploadStudentAvatar = async (id: number, params: FormData): Promise<RestResponse> => {
    const response = await api.post(`/api/students/${id}/avatar`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const updateStudent = async (id: number, params: UpdateParams): Promise<RestResponse> => {
    const response = await api.put(`/api/students/${id}`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

type CreateParams = {
    id: number,
    full_name: string,
    birth_date: string,
    gender: string,
    address: string,

    status: string,

    parent_id: number,
    class_id: number,
    pickup_id: number,
}

type UpdateParams = {
    full_name?: string,
    birth_date?: string,
    gender?: string, 
    address?: string,

    status?: string,

    parent_id?: number,
    class_id?: number,
    pickup_id?: number,
}