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
  active_id?: number;
  bus_lat?: number;
  bus_lng?: number;
  bus_speed?: number;
}

// Kiểu dữ liệu vận hành xe
// - Chưa format
export interface ActiveNotFormatType {
  id?: number;
  schedule_id?: number;
  start_at?: string;
  end_at?: string;
  bus_lat?: number;
  bus_lng?: number;
  bus_speed?: number;
  status?: string;
  active_pickups?: ActivePickupNotFormatType[];
  active_students?: ActiveStudentNotFormatType[]; 
  informs?: InformNotFormatType[];
}
// - Đã format
export interface ActiveFormatType {
  id?: number;
  schedule?: ScheduleFormatType;
  start_at?: string;
  end_at?: string;
  bus_lat?: number;
  bus_lng?: number;
  bus_speed?: number;
  bus_status?: string;
  status?: string;
  active_pickups?: ActivePickupFormatType[];
  active_students?: ActiveStudentFormatType[]; 
  informs?: InformFormatType[];
  current_active_student?: ActiveStudentFormatType;
}
// Kiểu dữ liệu vận hành xe - trạm xe buýt
// - Chưa format
export interface ActivePickupNotFormatType {
  active_id?: number;
  pickup_id?: number;
  order?: number;
  at?: string;
  status?: string;
}
// - Đã format
export interface ActivePickupFormatType {
  pickup?: PickupType;
  order?: number;
  at?: string;
  status?: string;
}
// Kiểu dữ liệu vận hành xe - học sinh
// - Chưa format
export interface ActiveStudentNotFormatType {
  active_id?: number;
  studentId?: number;
  at?: string;
  status?: string;
}
// - Đã format
export interface ActiveStudentFormatType {
  student?: StudentFormatType;
  at?: string;
  status?: string;
}
// Kiểu dữ liệu thông báo
// - Chưa format
export interface InformNotFormatType {
  id?: number;
  active_id?: number;
  at?: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  message?: string;
  description?: string;
}
// - Đã format
export interface InformFormatType {
  id?: number;
  active?: ActiveFormatType;
  route?: RouteFormatType;
  bus?: BusType;
  driver?: DriverFormatType;
  at?: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  message?: string;
  description?: string;
}
// Kiểu dữ liệu phân công
// - Chưa format
export interface ScheduleNotFormatType {
  id?: number;
  route_id?: number;
  bus_id?: number;
  driver_id?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  actives?: ActiveNotFormatType[];
}
export interface ScheduleFormatType {
  id?: number;
  route?: RouteFormatType;
  bus?: BusType;
  driver?: DriverFormatType;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  days_of_week?: string;
  status?: string;
  actives?: ActiveFormatType[];

}
// <==================          ======================>

// Kiểu dữ liệu tuyến đường
// - Chưa format
export interface RouteNotFormatType {
  id?: number;
  name?: string;
  start_pickup?: string;
  end_pickup?: string;
  total_distance?: number;
  total_time?: number;
  status?: string;
  routeDetails?: RouteDetailsNotFormatType[];
}
// - Đã format
export interface RouteFormatType {
  id?: number;
  name?: string;
  start_pickup?: string;
  end_pickup?: string;
  total_distance?: number;
  total_time?: number;
  status?: string;
  routeDetails?: RouteDetailsFormatType[];
  routePickups?: RouteDetailsFormatType[];
}

// Kiểu dữ liệu chi tiết tuyến đường
// - Chưa format
export interface RouteDetailsNotFormatType {
  route_id?: number;
  pickup_id?: number;
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
  license_plate?: string;
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
  full_name?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}
// - Đã format
export interface DriverFormatType {
  id?: number;
  avatar?: string;
  account_id?: number;
  username?: string;
  full_name?: string;
  birth_date?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}

// Kiểu dữ liệu phụ huynh
// - Chưa format
export interface ParentNotFormatType {
  id?: number;
  account_id?: number;
  username?: string;
  password?: string;
  avatar?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}
// - Đã format
export interface ParentFormatType {
  id?: number;
  account_id?: number;
  username?: string;
  avatar?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}

// Kiểu dữ liệu học sinh
// - Chưa format
export interface StudentNotFormatType {
  id?: number;
  parent_id?: number;
  pickup_id?: number;
  class_id?: number;
  avatar?: string;
  card_id?: string;
  full_name?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  status?: string;
}
// - Đã format
export interface StudentFormatType {
  id?: number;
  avatar?: string;
  card_id?: string;
  full_name?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  status?: string;
  
  parent?: ParentFormatType;
  pickup?: PickupType;
  class?: ClassType;
}
