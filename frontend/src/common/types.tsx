// Kiểu dữ liệu nguời dùng
export interface UserType {
  id?: number;
  role?: string;
  username?: string;
  password?: string;
  status?: string;
}

// Kiểu dữ liệu lớp
export interface ClassType {
  id?: number;
  name?: string;
}

// <========== HIỆN TẠI TÔI CHỈ VIẾT ĐỂ CÓ CÁI LÀM TRÊN GIAO DIỆN THÔI NHA ===========>
// <========== NHÓM BÀN VỚI NHAU RỒI SỬA LẠI, CHỨ KHÔNG PHẢI LÀM THEO KIỂU NÀY ===========>
// Kiểu dữ liệu thông tin xe vận hành
export interface BusInfoType {
  activeId?: number;
  busLat?: number;
  busLng?: number;
  busSpeed?: number;
}

// Kiểu dữ liệu vận hành xe
// - Chưa format
export interface ActiveNotFormatType {
  id?: number;
  scheduleId?: number;
  createTime?: string;
  startTime?: string;
  endTime?: string;
  busLat?: number;
  busLng?: number;
  busSpeed?: number;
  status?: string;
  activePickups?: ActivePickupNotFormatType[];
  activeStudents?: ActiveStudentNotFormatType[]; 
}
// - Đã format
export interface ActiveFormatType {
  id?: number;
  schedule?: ScheduleFormatType;
  createTime?: string;
  startTime?: string;
  endTime?: string;
  busLat?: number;
  busLng?: number;
  busSpeed?: number;
  status?: string;
  activePickups?: ActivePickupFormatType[];
  activeStudents?: ActiveStudentFormatType[]; 
}
// Kiểu dữ liệu vận hành xe - trạm xe buýt
// - Chưa format
export interface ActivePickupNotFormatType {
  activeId?: number;
  pickupId?: number;
  time?: string;
  status?: string;
}
// - Đã format
export interface ActivePickupFormatType {
  pickup?: PickupType;
  time?: string;
  status?: string;
}
// Kiểu dữ liệu vận hành xe - học sinh
// - Chưa format
export interface ActiveStudentNotFormatType {
  activeId?: number;
  studentId?: number;
  time?: string;
  status?: string;
}
// - Đã format
export interface ActiveStudentFormatType {
  student?: StudentFormatType;
  time?: string;
  status?: string;
}
// Kiểu dữ liệu thông báo
// - Chưa format
export interface InformNotFormatType {
  id?: number;
  userId?: number;
  activeId?: number;
  time?: string;
  type?: string;
  message?: string;
  description?: string;
}
// - Đã format
export interface InformNotFormatType {
  id?: number;
  user?: UserType;
  active?: ActiveFormatType;
  time?: string;
  type?: string;
  message?: string;
  description?: string;
}
// Kiểu dữ liệu phân công
// - Chưa format
export interface ScheduleNotFormatType {
  id?: number;
  routeId?: number;
  busId?: number;
  driverId?: number;
  startDate?: string;
  endDate?: string;
}
export interface ScheduleFormatType {
  id?: number;
  route?: RouteFormatType;
  bus?: BusType;
  driver?: DriverFormatType;
  startDate?: string;
  endDate?: string;
}
// <==================          ======================>

// Kiểu dữ liệu tuyến đường
// - Chưa format
export interface RouteNotFormatType {
  id?: number;
  name?: string;
  startPickup?: string;
  endPickup?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  routeDetails?: RouteDetailsNotFormatType[];
}
// - Đã format
export interface RouteFormatType {
  id?: number;
  name?: string;
  startPickup?: string;
  endPickup?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  routeDetails?: RouteDetailsFormatType[];
}

// Kiểu dữ liệu chi tiết tuyến đường
// - Chưa format
export interface RouteDetailsNotFormatType {
  routeId?: number;
  pickupId?: number;
  order?: number;
}
// - Đã format
export interface RouteDetailsFormatType {
  // route?: RouteFormatType;
  pickup?: PickupType;
  order?: number;
}

// Kiểu dữ liệu trạm xe buýt
export interface PickupType {
  id?: number;
  name?: string;
  category?: string;
  lat?: number;
  lng?: number;
  status?: string;
  students?: StudentFormatType[];
}

// Kiểu dữ liệu xe buýt
export interface BusType {
  id?: number;
  licensePlate?: string;
  capacity?: number;
  status?: string;
}

// Kiểu dữ liệu phụ huynh
// - Chưa format
export interface DriverNotFormatType {
  id?: number;
  username?: string;
  password?: string;
  avatar?: string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
  timeUpdate?: string;
}
// - Đã format
export interface DriverFormatType {
  id?: number;
  user?: UserType;
  avatar?: string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu phụ huynh
// - Chưa format
export interface ParentNotFormatType {
  id?: number;
  account_id?: number;
  username?: string;
  password?: string;
  avatar?: string;
  fullname?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
  timeUpdate?: string;
}
// - Đã format
export interface ParentFormatType {
  id?: number;
  user?: UserType;
  account?: UserType;
  avatar?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
  timeUpdate?: string;
}

// Kiểu dữ liệu học sinh
// - Chưa format
export interface StudentNotFormatType {
  id?: string;
  parentId?: number;
  pickupId?: number;
  classId?: number;
  avatar?: string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  status?: string;
  timeUpdate?: string;
}
// - Đã format
export interface StudentFormatType {
  id?: string;
  parent?: ParentFormatType;
  pickup?: PickupType;
  class?: ClassType;
  avatar?: string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  status?: string;
  timeUpdate?: string;
}
