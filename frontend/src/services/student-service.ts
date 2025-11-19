import { api, type RestResponse } from "../api/api";

export const getStudents = async (): Promise<RestResponse> => {
    const response = await api.get("/api/students");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const getStudentsActive = async (): Promise<RestResponse> => {
    const response = await api.get("/api/students/active");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const createStudent = async (params: CreateParams): Promise<RestResponse> => {
    const response = await api.post("/api/students", params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const uploadStudentAvatar = async (id: string, params: FormData): Promise<RestResponse> => {
    const response = await api.post(`/api/students/${id}/avatar`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const updateStudent = async (id: string, params: UpdateParams): Promise<RestResponse> => {
    const response = await api.put(`/api/students/${id}`, params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}

type CreateParams = {
    id: string,
    fullName: string,
    birthDate: string,
    gender: string,
    address: string,

    status: string,

    parentId: number,
    classId: number,
    pickupId: number,
}

type UpdateParams = {
    fullName?: string,
    birthDate?: string,
    gender?: string, 
    address?: string,

    status?: string,

    parentId?: number,
    classId?: number,
    pickupId?: number,
}