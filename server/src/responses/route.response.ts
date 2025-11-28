import { PickupResponse } from "./pickup.response";

export type RouteResponse = {
  id: number;
  name?: string;
  start_pickup?: string;
  end_pickup?: string;
  total_distance?: number;
  total_time?: number;
  status?: "ACTIVE" | "INACTIVE";
  routePickups?: {
    pickup?: PickupResponse;
    order?: number;
  }[];
};