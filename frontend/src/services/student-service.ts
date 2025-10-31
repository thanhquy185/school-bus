import { api, type RestResponse } from "../api/api";

export const getStudents = async (): Promise<RestResponse> => {
    const response = await api.get("/api/students");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const createStudent = async (params: FormData): Promise<RestResponse> => {
    console.log("Creating student with params:", params);
    const response = await api.post("/api/students", params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}