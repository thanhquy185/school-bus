import { StudentResponse } from "./student.response";

export type ActiveStudentResponse = {
  active_id?: number;
  student_id?: number;
  student?: StudentResponse;
  at?: string;
  status?: "PENDING" | "ABSENT" | "LEAVE" | "CHECKED";
};
