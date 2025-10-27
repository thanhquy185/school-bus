import zod from 'zod'

export const getSchema = zod.object({
  id: zod.number().min(1, "Yêu cầu mã phụ huynh hợp lệ")
});


export const createSchema = zod.object(
    {
        full_name: zod.string().optional(),
        phone: zod.string().optional(),
        email: zod.string().optional(),
        address: zod.string().optional(),

        account_id: zod.number().optional(),
        username: zod
    .string()
    .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự")
    .optional(),
      avatar: zod
    .string()
    .url("Ảnh đại diện phải là đường dẫn hợp lệ")
    .optional()
    .describe("Ảnh đại diện của phụ huynh"),
        status: zod
            .enum(["ACTIVE", "INACTIVE"])
            .optional()
            .describe("Trạng thái tài khoản của phụ huynh"),

        password: zod
            .string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .optional()
            .describe("Mật khẩu mới"),
        role: zod.enum(["PARENT"]).default("PARENT"),
    }
);

        export const updateSchema = zod.object({
        id: zod.number().min(1, "ID phụ huynh không hợp lệ"),


        full_name: zod.string().optional(),
        phone: zod.string().optional(),
        email: zod.string().optional(),
        address: zod.string().optional(),

        account_id: zod.number().optional(),
    avatar: zod
    .string()
    .url("Ảnh đại diện phải là đường dẫn hợp lệ")
    .optional()
    .describe("Ảnh đại diện của phụ huynh"),
        status: zod
            .enum(["ACTIVE", "INACTIVE"])
            .optional()
            .describe("Trạng thái tài khoản của phụ huynh"),

        password: zod
            .string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .optional()
            .describe("Mật khẩu mới"),
        });

export const deleteSchema = zod.object(
    {
        id: zod.number().min(1, "ID phụ huynh không hợp lệ")
    }
);