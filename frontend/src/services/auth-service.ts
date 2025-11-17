import { api, type RestResponse } from "../api/api";

export const login = async (username: string, password: string): Promise<RestResponse> => {
    const response = await api.post("/auth/login", { username: username, password: password });
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const authConfig = async (): Promise<RestResponse> => {
    const response = await api.post("/auth/authConfig");
    const restResponse: RestResponse = response.data;
    return restResponse;
}