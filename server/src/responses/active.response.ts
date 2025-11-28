import { ScheduleResponse } from "./schedule.response";
import { ActivePickupResponse } from "./active-pickup.response";
import { ActiveStudentResponse } from "./active-student.response";
import { InformResponse } from "./inform.response";

export type ActiveResponse = {
  id: number;
  schedule?: ScheduleResponse;
  start_at?: string;
  end_at?: string;
  bus_lat?: number;
  bus_lng?: number;
  bus_speed?: number;
  bus_status?: string;
  status?: string;
  active_pickups?: ActivePickupResponse[];
  active_students?: ActiveStudentResponse[];
  informs?: InformResponse[];
  current_active_student?: ActiveStudentResponse;
};
