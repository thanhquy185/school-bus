import z from "zod";

export const createScheduleSchema = z.object({
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
  endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
  startTime: z.string().min(1, "Giờ bắt đầu không được để trống"),
  endTime: z.string().min(1, "Giờ kết thúc không được để trống"),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    message: "Trạng thái không hợp lệ",
  }),

  driverId: z.number().min(1, "Yêu cầu mã tài xế"),
  busId: z.number().min(1, "Yêu cầu mã xe bus"),
  routeId: z.number().min(1, "Yêu cầu mã tuyến đường"),
});

export const updateScheduleSchema = z.object({
  id: z.number().min(1, "Mã lịch trình không hợp lệ"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    message: "Trạng thái không hợp lệ",
  }).optional(),

  driverId: z.number().optional(),
  busId: z.number().optional(),
  routeId: z.number().optional(),
});
