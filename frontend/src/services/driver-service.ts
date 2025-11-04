import { api, type RestResponse } from "../api/api";
// import type { DriverFormatType } from "../common/types";

const getDrivers = async (): Promise<RestResponse> => {
  const response = await api.get("/api/drivers");
  const restResponse: RestResponse = response.data;
  return restResponse;
};

const createDriver = async (params: CreateParams): Promise<RestResponse> => {
  // console.log("hello1");
  const response = await api.post("/api/drivers", params);
  // console.log("hello2");
  const restResponse: RestResponse = response.data;
  // console.log("hello3");
  return restResponse;
};

export const uploadDriverAvatar = async (
  id: number,
  params: FormData
): Promise<RestResponse> => {
  const response = await api.post(`/api/drivers/${id}/avatar`, params);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

const updateDriver = async (
  id: number,
  params: UpdateParams
): Promise<RestResponse> => {
  const response = await api.put(`/api/drivers/${id}`, params);
  const restResponse: RestResponse = response.data;
  return restResponse;
};

type CreateParams = {
  avatar: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  birth_date: string;
  gender: string;
  username: string;
  password: string;
  status: string;
};

type UpdateParams = {
  full_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  gender?: string;
  avatar?: string;
  birth_date?: string;
  password?: string;
  status?: string;
};

export { getDrivers, createDriver, updateDriver };
