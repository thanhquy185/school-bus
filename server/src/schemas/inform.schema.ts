import z from "zod";

export const getSchema = z.object({
    id: z.number().min(1, "Yêu cầu mã tài khoản")
});

export const createSchema = z.object({
    active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
    at: z.string().min(1, "Thời gian thông báo không được để trống"),
    type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"], "Loại thông báo không hợp lệ"),
    message: z.string().min(1, "Tiêu đề thông báo không được để trống"),
    description: z.string().min(1, "Chi tiết thông báo không được để trống"),
});

export const updateSchema = z.object({
    id: z.number().min(1, "Yêu cầu mã thông báo"),
    active_id: z.number().min(1, "Mã vận hành xe buýt không được để trống"),
    at: z.string().min(1, "Thời gian thông báo không được để trống").optional(),
    type: z.enum(["INFO", "SUCCESS", "WARNING", "error"], "Loại thông báo không hợp lệ").optional(),
    message: z.string().min(1, "Tiêu đề thông báo không được để trống").optional(),
    description: z.string().min(1, "Chi tiết thông báo không được để trống").optional(),
});

export const deleteSchema = z.object({
    id: z.number().min(1, "Yêu cầu mã thông báo")
});