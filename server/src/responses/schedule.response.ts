import { AccountResponse } from "./account.response";
import { BusResponse } from "./bus.respone";
import { DriverResponse } from "./driver.response";
import { RouteResponse } from "./route.response";

export type ScheduleResponse = {
  id: number;
  route?: RouteResponse;
  driver?: DriverResponse;
  bus?: BusResponse;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  days_of_week?: string;
  status?: "ACTIVE" | "INACTIVE";
  actives?: AccountResponse[];
};
