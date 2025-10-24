import zod from "zod";

const createDriverSchema = zod.object({
  avatar: zod
    .string()
    .nonempty("Ảnh đại diện tài xế không được để trống")
    .url("Đường dẫn ảnh phải hợp lệ"),
  fullname: zod
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
});

const updateDriverSchema = zod.object({
  id: zod.number().min(1, "Yêu cầu mã tài xế hợp lệ"),
  avatar: zod
    .string()
    .nonempty("Ảnh đại diện tài xế không được để trống")
    .url("Đường dẫn ảnh phải hợp lệ"),
  fullname: zod
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
});

const getDriverSchema = zod.object({
  id: zod.number().min(1, "Yêu cầu mã tài xế hợp lệ"),
});

const deleteDriverSchema = zod.object({
  id: zod.number().min(1, "Yêu cầu mã tài xế hợp lệ"),
});

export {
  createDriverSchema,
  updateDriverSchema,
  getDriverSchema,
  deleteDriverSchema,
};
