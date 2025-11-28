import z from "zod";
export const getSchema = z.object({
  id: z.number().min(1, "Yêu cầu mã tuyến đường"),
});

export const createSchema = z.object({
  name: z.string().min(1, "Tên tuyến đường không được để trống").optional().optional(),
  start_pickup: z.string().min(1, "Trạm bắt đầu không được để trống").optional(),
  end_pickup: z.string().min(1, "Trạm kết thúc không được để trống").optional(),
  total_distance: z
    .number()
    .int()
    .min(0, "Tổng quãng đường không được để trống").optional(),
  total_time: z.number().int().min(0, "Tổng thời gian không được để trống").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], "Trạng thái tuyến đường không hợp lệ").optional(),
  routePickups: z
    .array(
      z.object({
        pickup_id: z.number().int().min(1, "Mã trạm xe buýt không hợp lệ").optional(),
        order: z.number().int().min(1, "Thứ tự trạm không hợp lệ").optional(),
      })
    )
    .min(2, "Danh sách trạm cần chứa ít nhất 2 trạm xe buýt").optional(),
});

export const updateSchema = z.object({
  id: z.number().min(1, "Mã tuyến đường không hợp lệ").optional(),
  name: z.string().min(1, "Tên tuyến đường không được để trống").optional(),
  start_pickup: z.string().min(1, "Trạm bắt đầu không được để trống").optional(),
  end_pickup: z.string().min(1, "Trạm kết thúc không được để trống").optional(),
  total_distance: z
    .number()
    .int()
    .min(0, "Tổng quãng đường không được để trống").optional(),
  total_time: z.number().int().min(0, "Tổng thời gian không được để trống").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], "Trạng thái tuyến đường không hợp lệ").optional(),
  routePickups: z
    .array(
      z.object({
        pickup_id: z.number().int().min(1, "Mã trạm xe buýt không hợp lệ"),
        order: z.number().int().min(1, "Thứ tự trạm không hợp lệ"),
      })
    )
    .min(2, "Danh sách trạm cần chứa ít nhất 2 trạm xe buýt").optional(),
});

export const deleteSchema = z.object({
  id: z.number().min(1, "Yêu cầu trạm xe buýt"),
});