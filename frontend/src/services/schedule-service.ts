import { api, type RestResponse } from "../api/api";

// Lấy 1 lịch trình theo id
export const getSchedule = async (id: number): Promise<RestResponse> => {
  const response = await api.get(`/api/schedules/${id}`);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Lấy tất cả lịch trình
export const getSchedules = async (): Promise<RestResponse> => {
  const response = await api.get("/api/schedules");
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Lấy tất cả lịch trình đang hoạt động
export const getSchedulesActive = async (): Promise<RestResponse> => {
  const response = await api.get("/api/schedules/all-active");
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Tạo lịch trình mới
export const createSchedule = async (params: CreateParams): Promise<RestResponse> => {
  const response = await api.post("/api/schedules", params);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Cập nhật lịch trình
export const updateSchedule = async (id: number, params: UpdateParams): Promise<RestResponse> => {
  const response = await api.put(`/api/schedules/${id}`, params);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Xóa lịch trình
export const deleteSchedule = async (id: number): Promise<RestResponse> => {
  const response = await api.delete(`/api/schedules/${id}`);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

// Kiểu dữ liệu cho tham số
export type CreateParams = {
  route_id: number;
  bus_id: number;
  driver_id: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  days_of_week?: string;
  status: "ACTIVE" | "INACTIVE";
};

export type UpdateParams = {
  route_id?: number;
  bus_id?: number;
  driver_id?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  days_of_week?: string;
  status?: "ACTIVE" | "INACTIVE";
};
