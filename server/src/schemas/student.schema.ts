import z from "zod";

export const createSchema = z.object({
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    birthDate: z.string().min(1, "Ngày sinh không được để trống"),
    gender: z.enum(["MALE", "FEMALE"], "Giới tính không hợp lệ"),
    address: z.string().min(1, "Địa chỉ không được để trống"),

    status: z.enum(["STUDYING", "DROPPED_OUT", "UNKNOWN"], "Trạng thái không hợp lệ"),

    // parentId: z.number().min(1, "Yêu cầu mã phụ huynh"),
    // classId: z.number().min(1, "Yêu cầu mã lớp học"),
});
