import { api, type RestResponse } from "../api/api";
<<<<<<< HEAD

export const getPickups = async (): Promise<RestResponse> => {
    const response = await api.get("/api/pickups");
    const restResponse: RestResponse = response.data;
    return restResponse;
}
=======
import type { PickupType } from "../common/types";


export const getPickups = async () => {
    const response = await api.get("/api/pickups");
    const data: RestResponse = response.data;
    // console.log("Fetch pickups")
    // console.log(data)
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
>>>>>>> 7d1171e390109384948327668e287a7ca5af9370
