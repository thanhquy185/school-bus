import z from "zod";

export const createSchema = z.object({
    name: z.string().min(1, "Tên lớp học không được để trống")
});