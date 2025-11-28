import z from "zod";

export const createSchema = z.object({
  active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
  pickup_id: z.number().min(1, "Mã trạm xe buýt không được để trống"),
  order: z.number().min(1, "Thứ tự trạm xe buýt không được để trống"),
  at: z.string().min(1, "Thời gian không được để trống").optional(),
  status: z.enum(["PENDING", "CANCELED", "DRIVING", "CONFIRMED"]),
});

export const updateSchema = z.object({
  active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
  pickup_id: z.number().min(1, "Mã trạm xe buýt không được để trống"),
  order: z.number().optional(),
  at: z.string().min(1, "Thời gian không được để trống").optional(),
  status: z.enum(["PENDING", "CANCELED", "DRIVING", "CONFIRMED"]).optional(),
});

export const deleteSchema = z.object({
  active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
  pickup_id: z.number().min(1, "Mã trạm xe buýt không được để trống"),
});
