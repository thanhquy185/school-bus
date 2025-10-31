import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type RestResponse = {
  statusCode: number,
  result: boolean,
  data: any,
  message: string,
  errorMessage: string | string[] | object | object[] | any
}

const api = axios.create({
  baseURL: SERVER_URL
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: any) => {
    if (!error.response) {
      throw new Error("Network Error");
    }
    return error.response;
  }
);

api.interceptors.request.use((config) => {
  return config;
});

export { api };
export type { RestResponse };