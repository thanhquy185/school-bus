// Giới tính chung
export const CommonGenderValue = {
  male: "Nam",
  female: "Nữ",
};

// Trạng thái chung
export const CommonStatusValue = {
  active: "Hoạt động",
  inactive: "Tạm dừng",
};

export const StudentStatusValue = {
  studying: "Đang học",
  dropped_out: "Đã nghỉ học",
}

export const BusStatusValue = {
  active: "Hoạt động",
  inactive: "Tạm dừng",
}

// Trạng thái vận hành xe buýt
export const ActiveStatusValue = {
  pending: "Đang chờ vận hành",
  incident: "Đang có sự cố",
  running: "Đang chạy xe",
  success: "Đã hoàn thành"
}

// Trạng thái vận hành xe buýt - học sinh
export const ActiveStudentStatusValue = {
  pending: "Đang chờ xác nhận",
  leave: "Đã nghỉ phép",
  canceled: "Đã nghỉ học",
  confirmed: "Đã điểm danh"
}

// Trạng thái vận hành xe buýt - trạm xe buýt
export const ActivePickupStatusValue = {
  pending: "Đang chờ xác nhận",
  driving: "Đang đến trạm",
  canceled: "Đã huỷ trạm",
  confirmed: "Đã đến trạm",
}

// Loại điểm trên bản đồ chung
export const PointTypeValue = {
  school: "Trường học",
  pickup: "Điểm đưa đón",
  bus: "Xe buýt",
}
