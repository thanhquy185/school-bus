import zod from "zod";

const createSchema = zod.object({
  avatar: zod.string().nonempty("Ảnh đại diện tài xế không được để trống"),
  // .url("Đường dẫn ảnh phải hợp lệ"),
  full_name: zod
    .string()
    .nonempty("Tên tài xế không được để trống")
    .min(2, "Tên phải có ít nhất 2 kí tự")
    .max(50, "Tên không hợp lệ"),
  birth_date: zod
    .string()
    .nonempty("Ngày sinh không được trống")
    .refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ"),
  gender: zod.enum(["FEMALE", "MALE"], "Giới tính không hợp lệ"),
  phone: zod
    .string()
    .nonempty("Số điện thoại không được để trống")
    .regex(/^0\d{9}$/, "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"),
  email: zod
    .string()
    .nonempty("Email không được để trống")
    .email("Địa chỉ email không hợp lệ"),
  address: zod
    .string()
    .nonempty("Địa chỉ không được để trống")
    .min(6, "Địa chỉ ít nhất phải có 5 kí tự")
    .max(1000, "Địa chỉ không hợp lệ"),
  status: zod
    .enum(["ACTIVE", "INACTIVE"], "Trạng thái không hợp lệ")
    .default("ACTIVE"),
  username: zod
    .string()
    .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự")
    .optional(),
  password: zod
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .optional()
    .describe("Mật khẩu mới"),
});

const updateSchema = zod.object({
  id: zod.number().min(1, "Yêu cầu mã tài xế hợp lệ"),
  avatar: zod
    .string()
    // .regex(/^[\w\-.]+\.png$/i, "Ảnh đại diện phải là file PNG hợp lệ")
    .optional()
    .describe("Ảnh đại diện của phụ huynh"),
  full_name: zod
    .string()
    .nonempty("Tên tài xế không được để trống")
    .min(2, "Tên phải có ít nhất 2 kí tự")
    .max(50, "Tên không hợp lệ")
    .optional(),
  birth_date: zod
    .string()
    .nonempty("Ngày sinh không được trống")
    .refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ")
    .optional(),
  gender: zod.enum(["FEMALE", "MALE"], "Giới tính không hợp lệ").optional(),
  phone: zod
    .string()
    .nonempty("Số điện thoại không được để trống")
    .regex(/^0\d{9}$/, "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0")
    .optional(),
  email: zod
    .string()
    .nonempty("Email không được để trống")
    .email("Địa chỉ email không hợp lệ")
    .optional(),
  address: zod
    .string()
    .nonempty("Địa chỉ không được để trống")
    .min(6, "Địa chỉ ít nhất phải có 5 kí tự")
    .max(1000, "Địa chỉ không hợp lệ")
    .optional(),
  status: zod
    .enum(["ACTIVE", "INACTIVE"], "Trạng thái không hợp lệ")
    .default("ACTIVE"),
  password: zod
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .optional()
    .describe("Mật khẩu mới")
    .optional(),
  account_id: zod.number().optional(),
});

const getSchema = zod.object({
  id: zod.number().min(1, "Yêu cầu mã tài xế hợp lệ"),
});

const deleteSchema = zod.object({
  id: zod.number().min(1, "Yêu cầu mã tài xế hợp lệ"),
});

export { createSchema, updateSchema, getSchema, deleteSchema };
