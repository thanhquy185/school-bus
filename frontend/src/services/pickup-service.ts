import { api, type RestResponse } from "../api/api";
import type { PickupType } from "../common/types";


export const getPickups = async () => {
    const response = await api.get("/api/pickups");
    const data: RestResponse = response.data;
    return data;
};

export const updatePickup = async (form: PickupType) => {
    const response = await api.put(`/api/pickups/${form.id}`, form);
    const data: RestResponse = response.data;

    return data;
};

export const createPickup = async (form: PickupType) => {
    const response = await api.post("/api/pickups", form);
    const data: RestResponse = response.data;

    return data;
};
