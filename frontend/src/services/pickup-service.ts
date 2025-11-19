import { api, type RestResponse } from "../api/api";

// Lấy 1 trạm theo id
export const getPickup = async (id: number): Promise<RestResponse> => {
  const response = await api.get(`/api/pickups/${id}`);
  return response.data;
};

// Lấy tất cả trạm
export const getPickups = async (): Promise<RestResponse> => {
  const response = await api.get("/api/pickups");
  return response.data;
};

// Lấy tất cả trạm ACTIVE
export const getPickupsActive = async (): Promise<RestResponse> => {
  const response = await api.get("/api/pickups/active");
  return response.data;
};

// Tạo trạm mới
export const createPickup = async (params: CreateParams): Promise<RestResponse> => {
  const response = await api.post("/api/pickups", params);
  return response.data;
};

// Cập nhật trạm theo id
export const updatePickup = async (id: number, params: UpdateParams): Promise<RestResponse> => {
  const response = await api.put(`/api/pickups/${id}`, params);
  return response.data;
};

// Xóa trạm
export const deletePickup = async (id: number): Promise<RestResponse> => {
  const response = await api.delete(`/api/pickups/${id}`);
  return response.data;
};

// Types
export type CreateParams = {
  name: string;
  category: string;
  lat: number;
  lng: number;
  status: "ACTIVE" | "INACTIVE";
};

export type UpdateParams = {
  name?: string;
  category?: string;
  lat?: number;
  lng?: number;
  status?: "ACTIVE" | "INACTIVE";
};
