import z from "zod";

export const createSchema = z.object({
    full_name: z.string().min(1, "Họ và tên không được để trống"),
    birth_date: z.string().min(1, "Ngày sinh không được để trống"),
    gender: z.enum(["MALE", "FEMALE"], "Giới tính không hợp lệ"),
    address: z.string().min(1, "Địa chỉ không được để trống"),

    status: z.enum(["STUDYING", "DROPPED_OUT"], "Trạng thái không hợp lệ"),

    parent_id: z.number().min(1, "Yêu cầu mã phụ huynh"),
    class_id: z.number().min(1, "Yêu cầu mã lớp học"),
    pickup_id: z.number().min(1, "Yêu cầu mã trạm xe buýt")
});

export const updateSchema = z.object({
    id: z.number().min(1, "Mã học sinh không hợp lệ"),
    full_name: z.string().min(1, "Họ và tên không được để trống").optional(),
    birth_date: z.string().min(1, "Ngày sinh không được để trống").optional(),
    gender: z.enum(["MALE", "FEMALE"], "Giới tính không hợp lệ").optional(),
    address: z.string().min(1, "Địa chỉ không được để trống").optional(),

    status: z.enum(["STUDYING", "DROPPED_OUT", "UNKNOWN"], "Trạng thái không hợp lệ").optional(),

    parent_id: z.number().min(1, "Yêu cầu mã phụ huynh").optional(),
    class_id: z.number().min(1, "Yêu cầu mã lớp học").optional(),
    pickup_id: z.number().min(1, "Yêu cầu mã trạm xe buýt").optional()
})