import { ActiveResponse } from "./active.response";
import { BusResponse } from "./bus.respone";
import { DriverResponse } from "./driver.response";
import { RouteResponse } from "./route.response";

export type InformResponse = {
  id: number;
  active?: ActiveResponse;
  route?: RouteResponse;
  bus?: BusResponse;
  driver?: DriverResponse;
  at?: string;
  type?: "INFO" | "ERROR" | "WARNING" | "SUCCESS";
  message?: string;
  description?: string;
};
