import { api, type RestResponse } from "../api/api";

export const getActive = async (id: number): Promise<RestResponse> => {
  const response = await api.get(`/api/actives/${id}`);
  return response.data;
};

export const getActives = async (): Promise<RestResponse> => {
  const response = await api.get("/api/actives");
  return response.data;
};

export const getActivesActive = async (): Promise<RestResponse> => {
  const response = await api.get("/api/actives/all-active");
  return response.data;
};

export const createActive = async (params: CreateParams): Promise<RestResponse> => {
  const response = await api.post("/api/actives", params);
  return response.data;
};

export const updateActive = async (id: number, params: UpdateParams): Promise<RestResponse> => {
  const response = await api.put(`/api/actives/${id}`, params);
  return response.data;
};

export const deleteActive = async (id: number): Promise<RestResponse> => {
  const response = await api.delete(`/api/actives/${id}`);
  return response.data;
};

// Types
export type CreateParams = {
  schedule_id: number;
  start_at: string;
  end_at?: string;
  bus_lat?: number;
  bus_lng?: number;
  bus_speed?: number;
  bus_status?: string;
  status: "PENDING" | "CANCELED" | "ACTIVE" | "SUCCESS";
};

export type UpdateParams = {
  schedule_id?: number;
  start_at?: string;
  end_at?: string;
  bus_lat?: number;
  bus_lng?: number;
  bus_speed?: number;
  bus_status?: string;
  status?: "PENDING" | "CANCELED" | "ACTIVE" | "SUCCESS";
};
