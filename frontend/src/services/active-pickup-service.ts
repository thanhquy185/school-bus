import { api, type RestResponse } from "../api/api";

export const getActivePickup = async (id: number): Promise<RestResponse> => {
  const response = await api.get(`/api/active-pickups/${id}`);
  return response.data;
};

export const getActivePickups = async (): Promise<RestResponse> => {
  const response = await api.get("/api/active-pickups");
  return response.data;
};

export const createActivePickup = async (
  params: CreateParams
): Promise<RestResponse> => {
  const response = await api.post("/api/active-pickups", params);
  return response.data;
};

export const updateActivePickup = async (
  params: UpdateParams
): Promise<RestResponse> => {
  const response = await api.put(`/api/active-pickups`, params);
  return response.data;
};

export const deleteActivePickup = async (id: number): Promise<RestResponse> => {
  const response = await api.delete(`/api/active-pickups/${id}`);
  return response.data;
};

// Types
export type CreateParams = {
  active_id: number;
  pickup_id: number;
  order: number;
  at: string;
  status: "PENDING" | "CANCELED" | "DRIVING" | "CONFIRMED";
};

export type UpdateParams = {
  active_id: number;
  pickup_id: number;
  order?: number;
  at?: string;
  status?: "PENDING" | "CANCELED" | "DRIVING" | "CONFIRMED";
};
