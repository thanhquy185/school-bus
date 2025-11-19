import { PickupResponse } from "./pickup.response";

export type ScheduleResponse = {
  id: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;

  driver: {
    id: number;
    avatar: string;
    full_name: string;
    phone: string;
  };
  bus: {
    id: number;
    license_plate: string;
    capacity: number;
  };
  route: {
    id: number;
    name: string;
    startPickup: string;
    endPickup: string;
    totalDistance: number;
    totalTime: number;
    pickups: {
      pickup: PickupResponse;
      order: number;
    }[];
  };
};
