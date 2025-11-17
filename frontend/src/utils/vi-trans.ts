export const getStudentStatusText = (statusKey: string): string => {
    switch (statusKey) {
        case "STUDYING":
            return "Đang học";
        case "DROPPED_OUT":
            return "Đã nghỉ học";
        case "UNKNOWN":
            return "Chưa rõ";
        default:
            return "Không xác định";
    }
}

export const getAccountStatusText = (statusKey: string): string => {
    switch (statusKey) {
        case "ACTIVE":
            return "Hoạt động";
        case "INACTIVE":
            return "Tạm dừng";
        default:
            return "Không xác định";
    }
}

export const getCommonStatusText = (statusKey: string): string => {
    switch (statusKey) {
        case "ACTIVE":
            return "Hoạt động";
        case "INACTIVE":
            return "Tạm dừng";
        default:
            return "Không xác định";
    }
}

export const getGenderText = (genderKey: string): string => {
    switch (genderKey) {
        case "MALE":
            return "Nam";
        case "FEMALE":
            return "Nữ";
        default:
            return "Không xác định";
    }
}

export const getPickupCategoryName = (categoryKey: string): string => {
    switch (categoryKey) {
        case "SCHOOL":
            return "Trường học";
        case "PICKUP":
            return "Điểm đưa đón";
        default:
            return "Không xác định";
    }
}