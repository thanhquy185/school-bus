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
    avatar?: string;
    fullname?: string; 
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