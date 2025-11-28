import { api, type RestResponse } from "../api/api";

export const getActiveStudent = async (id: number): Promise<RestResponse> => {
  const response = await api.get(`/api/active-students/${id}`);
  return response.data;
};

export const getActiveStudents = async (): Promise<RestResponse> => {
  const response = await api.get("/api/active-students");
  return response.data;
};

export const createActiveStudent = async (
  params: CreateParams
): Promise<RestResponse> => {
  const response = await api.post("/api/active-students", params);
  return response.data;
};

export const updateActiveStudent = async (
  params: UpdateParams
): Promise<RestResponse> => {
  const response = await api.put(`/api/active-students`, params);
  return response.data;
};

export const deleteActiveStudent = async (
  id: number
): Promise<RestResponse> => {
  const response = await api.delete(`/api/active-students/${id}`);
  return response.data;
};


export const scanActiveStudent = async (
  params: ScanParams
): Promise<RestResponse> => {
  const response = await api.put(`/api/active-students/scan`, params);
  return response.data;
};

// Types
export type CreateParams = {
  active_id: number;
  student_id: number;
  at: string;
  status: "PENDING" | "ABSENT" | "LEAVE" | "CHECKED";
};

export type UpdateParams = {
  active_id: number;
  student_id: number;
  at?: string;
  status?: "PENDING" | "ABSENT" | "LEAVE" | "CHECKED";
};

export type ScanParams = {
  active_id: number;
  card_id: string;
  at?: string;
};
