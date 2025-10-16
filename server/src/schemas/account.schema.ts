import z from "zod";

export const getSchema = z.object({
    id: z.number().min(1, "Yêu cầu mã tài khoản")
});

export const createSchema = z.object({
    username: z.string().min(8, "Tài khoản có ít nhất 8 kí tự"),
    password: z.string().min(8, "Mật khẩu có ít nhất 8 kí tự"),
    role: z.enum(["ADMIN", "PARENT", "DRIVER"], "Quyền tài khoản không hợp lệ")
});

export const updateSchema = z.object({
    id: z.number().min(1, "Yêu cầu mã tài khoản"),
    password: z.string().min(8, "Mật khẩu có ít nhất 8 kí tự").optional(),
    role: z.enum(["ADMIN", "PARENT", "DRIVER"], "Quyền tài khoản không hợp lệ").optional(),
    status: z.enum(["ACTIVE", "INACTIVE"], "Trạng thái tài khoản không hợp lệ").optional()
});

export const deleteSchema = z.object({
    id: z.number().min(1, "Yêu cầu mã tài khoản")
});