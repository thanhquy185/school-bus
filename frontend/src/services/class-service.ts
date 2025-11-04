import { api, type RestResponse } from "../api/api";

export const getClasses = async (): Promise<RestResponse> => {
    const response = await api.get("/api/classes");
    const restResponse: RestResponse = response.data;
    return restResponse;
}

export const createClass = async (params: { name: string }): Promise<RestResponse> => {
    const response = await api.post("/api/classes", params);
    const restResponse: RestResponse = response.data;
    return restResponse;
}
