import { api, type RestResponse } from "../api/api";

export const getPickups = async (): Promise<RestResponse> => {
    const response = await api.get("/api/pickups");
    const restResponse: RestResponse = response.data;
    return restResponse;
}