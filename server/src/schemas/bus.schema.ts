import zod from "zod";

export const createSchema = zod.object({
    licensePlate: zod
        .string()
        .nonempty("Biển số xe không được để trống")
        .min(5, "Biển số xe không ít hơn 5 kí tự")
        .max(15, "Biển số xe không hợp lệ (quá dài)")
        .regex(/^[A-Z0-9\-]+$/, "Biển số xe chỉ được chứa chữ in hoa, số và dấu gạch ngang"),
    capacity: zod
        .number()
        .min(1, "Số chỗ ngồi phải lớn hơn 0")
        .max(50, "Số chỗ ngồi không hợp lệ (tối đa 50)")
        .nullable()
        .refine((val) => val !== null, "Số chỗ ngồi không được để trống"),
    status: zod.enum(["ACTIVE", "INACTIVE"], "Trạng thái xe không hợp lệ")
});

export const updateSchema = zod.object({
    id: zod.number().min(1, "Yêu cầu mã xe buýt hợp lệ"),
    licensePlate: zod
        .string()
        .nonempty("Biển số xe không được để trống")
        .min(5, "Biển số xe không ít hơn 5 kí tự")
        .max(15, "Biển số xe không hợp lệ (quá dài)")
        .regex(/^[A-Z0-9\-]+$/, "Biển số xe chỉ được chứa chữ in hoa, số và dấu gạch ngang")
        .optional(),
    capacity: zod
        .number()
        .min(1, "Số chỗ ngồi phải lớn hơn 0")
        .max(50, "Số chỗ ngồi không hợp lệ (tối đa 50)")
        .optional()
        .nullable()
        .refine((val) => val !== null, "Số chỗ ngồi không được để trống"),
    status: zod.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"], "Trạng thái xe không hợp lệ")
        .optional(),
});