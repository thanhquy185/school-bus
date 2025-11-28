import z from "zod";

export const createSchema = z.object({
  active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
  student_id: z.number().min(1, "Mã học sinh không được để trống"),
  at: z.string().min(1, "Thời gian không được để trống").optional(),
  status: z.enum(["PENDING", "ABSENT", "LEAVE", "CHECKED"]),
});

export const updateSchema = z.object({
  active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
  student_id: z.number().min(1, "Mã học sinh không được để trống"),
  at: z.string().min(1, "Thời gian không được để trống").optional(),
  status: z.enum(["PENDING", "ABSENT", "LEAVE", "CHECKED"]).optional(),
});

export const deleteSchema = z.object({
  active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
  student_id: z.number().min(1, "Mã học sinh không được để trống"),
});

export const scanSchema = z.object({
  active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
  card_id: z.string().min(1, "Mã thẻ học sinh không được để trống"),
  at: z.string().min(1, "Thời gian không được để trống").optional(),
});
