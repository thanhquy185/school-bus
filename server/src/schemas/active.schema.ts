import z from "zod";

export const getSchema = z.object({
    id: z.number().min(1, "Yêu cầu mã vận hành")
});

export const createSchema = z.object({
  schedule_id: z.number().min(1, "Mã lịch trình không được để trống"),
  start_at: z.string().min(1, "Thời gian bắt đầu không được để trống"),
  end_at: z.string().min(1, "Thời gian kết thúc không được để trống").optional(),
  bus_lat: z.number().min(1, "Vĩ độ xe buýt không được để trống").optional(),
  bus_lng: z.number().min(1, "Kinh độ xe buýt không được để trống").optional(),
  bus_speed: z.number().min(1, "Tốc độ xe buýt không được để trống").optional(),
  bus_status: z.string().min(1, "Trạng thái xe buýt không được để trống").optional(),
  status: z.enum(
    ["PENDING", "CANCELED", "ACTIVE", "SUCCESS"],
    "Trạng thái vận hành không hợp lệ"
  ),
});

export const updateSchema = z.object({
  id: z.number().min(1, "Mã vận hành không hợp lệ"),
  schedule_id: z.number().optional(),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
  bus_lat: z.number().optional(),
  bus_lng: z.number().optional(),
  bus_speed: z.number().optional(),
  bus_status: z.string().optional(),
  status: z
    .enum(
      ["PENDING", "CANCELED", "ACTIVE", "SUCCESS"],
      "Trạng thái vận hành không hợp lệ"
    )
    .optional(),
});

export const deleteSchema = z.object({
  id: z.number().min(1, "Mã vận hành không hợp lệ"),
});
