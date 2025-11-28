import z from "zod";

export const createScheduleSchema = z.object({
  start_date: z.string().min(1, "Ngày bắt đầu không được để trống"),
  end_date: z.string().min(1, "Ngày kết thúc không được để trống"),
  start_time: z.string().min(1, "Giờ bắt đầu không được để trống"),
  end_time: z.string().min(1, "Giờ kết thúc không được để trống"),
  days_of_week: z.string().min(1, "Thứ trong tuần không được để trống"),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    message: "Trạng thái không hợp lệ",
  }),

  driver_id: z.number().min(1, "Yêu cầu mã tài xế"),
  bus_id: z.number().min(1, "Yêu cầu mã xe bus"),
  route_id: z.number().min(1, "Yêu cầu mã tuyến đường"),
});

export const updateScheduleSchema = z.object({
  id: z.number().min(1, "Mã lịch trình không hợp lệ"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  days_of_week: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    message: "Trạng thái không hợp lệ",
  }).optional(),

  driver_id: z.number().optional(),
  bus_id: z.number().optional(),
  route_id: z.number().optional(),
});
