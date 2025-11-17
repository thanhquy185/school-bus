import z from "zod";

export const createSchema = z.object({
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  birthDate: z.string().min(1, "Ngày sinh không được để trống"),
  gender: z.enum(["MALE", "FEMALE"], "Giới tính không hợp lệ"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
  email: z.string().email("Email không hợp lệ").optional(),
  address: z.string().optional(),
  username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  status: z.enum(["ACTIVE", "INACTIVE"], "Trạng thái không hợp lệ"),
});

export const updateSchema = z.object({
  id: z.number().min(1, "ID tài xế không hợp lệ"),
  fullName: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  address: z.string().optional(),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .optional()
    .describe("Mật khẩu mới"),
  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional()
    .describe("Trạng thái tài khoản của tài xế"),
});
