import { api, type RestResponse } from "../api/api";

export const getInform = async (id: number): Promise<RestResponse> => {
  const response = await api.get(`/api/informs/${id}`);
  return response.data;
};

export const getInforms = async (): Promise<RestResponse> => {
  const response = await api.get("/api/informs");
  return response.data;
};

export const getInformsActive = async (): Promise<RestResponse> => {
  const response = await api.get("/api/informs/all-active");
  return response.data;
};

export const createInform = async (
  params: CreateParams
): Promise<RestResponse> => {
  const response = await api.post("/api/informs", params);
  return response.data;
};

export const updateInform = async (
  id: number,
  params: UpdateParams
): Promise<RestResponse> => {
  const response = await api.put(`/api/informs/${id}`, params);
  return response.data;
};

export const deleteInform = async (id: number): Promise<RestResponse> => {
  const response = await api.delete(`/api/informs/${id}`);
  return response.data;
};

// Types
export type CreateParams = {
  active_id: number;
  at: string;
  type: string;
  message: number;
  description: number;
};

export type UpdateParams = {
  active_id?: number;
  at?: string;
  type?: string;
  message?: number;
  description?: number;
};
