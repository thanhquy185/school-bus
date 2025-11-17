import { PickupResponse } from "./pickup.response";

export type RouteResponse = {
  id: number;
  name: string;
  startPickup: string;
  endPickup: string;
  totalDistance: number;
  totalTime: number;
  status: string;
  pickups: {
    pickup: PickupResponse;
    order: number;
  }[];
};