import { PickupResponse } from "./pickup.response";

export type ActivePickupResponse = {
  active_id?: number;
  pickup_id?: number;
  pickup?: PickupResponse;
  order?: number;
  at?: string;
  status?: "PENDING" | "CANCELED" | "DRIVING" | "CONFIRMED";
};
