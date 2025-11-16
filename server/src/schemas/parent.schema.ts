import z from "zod";

export const getSchema = z.object({
    id: z.number().min(1, "Yêu cầu mã phụ huynh hợp lệ")
});

export const createSchema = z.object({
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    phone: z.string().min(1, "Số điện thoại không được để trống"),
    email: z.string().email("Email không hợp lệ").optional(),
    address: z.string().optional(),
    username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    status: z.enum(["ACTIVE", "INACTIVE"], "Trạng thái không hợp lệ")
});

export const updateSchema = z.object({
    id: z.number().min(1, "ID phụ huynh không hợp lệ"),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Email không hợp lệ").optional(),
    address: z.string().optional(),
    status: z
        .enum(["ACTIVE", "INACTIVE"])
        .optional()
        .describe("Trạng thái tài khoản của phụ huynh"),

    password: z
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .optional()
        .describe("Mật khẩu mới"),
});

export const deleteSchema = z.object(
    {
        id: z.number().min(1, "ID phụ huynh không hợp lệ")
    }
);