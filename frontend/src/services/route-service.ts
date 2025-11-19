import { api, type RestResponse } from "../api/api";


// Lấy 1 tuyến đường theo id
export const getRoute = async (id: number): Promise<RestResponse> => {
  const response = await api.get(`/api/routes/${id}`);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Lấy tất cả tuyến đường
export const getRoutes = async (): Promise<RestResponse> => {
  const response = await api.get("/api/routes");
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Lấy tất cả tuyến đường đang hoạt động
export const getRoutesActive = async (): Promise<RestResponse> => {
  const response = await api.get("/api/routes/active");
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Tạo tuyến đường mới
export const createRoute = async (params: CreateParams): Promise<RestResponse> => {
  const response = await api.post("/api/routes", params);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Cập nhật tuyến đường
export const updateRoute = async (id: number, params: UpdateParams): Promise<RestResponse> => {
  const response = await api.put(`/api/routes/${id}`, params);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Xóa tuyến đường
export const deleteRoute = async (id: number): Promise<RestResponse> => {
  const response = await api.delete(`/api/routes/${id}`);
  const restResponse: RestResponse = response.data;
  return restResponse;
};


export type PickupItem = {
  pickupId: number;
  order: number;
};

export type CreateParams = {
  name: string;
  startPickup: string;
  endPickup: string;
  totalDistance: number;
  totalTime: number;
  status: "ACTIVE" | "INACTIVE";
  pickups: PickupItem[];
};

export type UpdateParams = {
  name?: string;
  startPickup?: string;
  endPickup?: string;
  totalDistance?: number;
  totalTime?: number;
  status?: "ACTIVE" | "INACTIVE";
  pickups?: PickupItem[];
};
