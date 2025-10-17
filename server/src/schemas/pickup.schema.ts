import zod from 'zod'

export const getSchema = zod.object(
    {
        id: zod.number().min(1, 'Yêu cầu mã tài khoản')
    }
);

export const createSchema = zod.object(
    {
        name: zod.string().min(1, "Tên điểm đón không được trống"),
        category: zod.enum(["SCHOOL", "PICKUP"], "Loại điểm đón không hợp lệ"),
        lat: zod.number().min(-90, "Vĩ độ phải từ -90 đến 90").max(90, "Vĩ độ phải từ -90 đến 90"),
        lng: zod.number().min(-180, "Kinh độ phải từ -180 đến 180").max(180, "Kinh độ phải từ -180 đến 180"),
        status: zod.enum(["ACTIVE", "INACTIVE"], "Trạng thái điểm đón không hợp lệ")
    }
);

export const updateSchema = zod.object(
    {
        id: zod.number().min(1, 'Yêu cầu mã tài khoản'),
        name: zod.string().optional(),
        category: zod.enum(["SCHOOL", "PICKUP"], "Loại điểm đón không hợp lệ").optional(),
        lat: zod.number().min(-90, "Vĩ độ phải từ -90 đến 90").max(90, "Vĩ độ phải từ -90 đến 90").optional(),
        lng: zod.number().min(-180, "Kinh độ phải từ -180 đến 180").max(180, "Kinh độ phải từ -180 đến 180").optional(),
        status: zod.enum(["ACTIVE", "INACTIVE"], "Trạng thái điểm đón không hợp lệ").optional()
    }
);

export const deleteSchema = zod.object(
    {
        id: zod.number().min(1, "Yêu cầu mã tài khoản")
    }
);