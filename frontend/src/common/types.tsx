// Kiểu dữ liệu phụ huynh
// - Chưa format
export interface RelationNotFormatType {
    id?: number;
    username?: string;
    password?: string;
    fullname?: string; 
    phone?: string;
    email?: string;
    address?: string;
    status?: string;
    timeUpdate?: string;
    relationStudents?: RelationStudentNotFormatType[];
}
// - Đã format
export interface RelationFormatType {
    id?: number;
    user?: UserType;
    fullname?: string; 
    phone?: string;
    email?: string;
    address?: string;
    status?: string;
    timeUpdate?: string;
    relationStudents?: RelationStudentFormatType[];
}

// Kiểu dữ liệu phụ huynh - học sinh
// - Chưa format
export interface RelationStudentNotFormatType {
    // relationId?: number;
    studentId?: number;
}
// - Đã format
export interface RelationStudentFormatType {
    // relation?: RelationFormatType;
    student?: StudentType;
}

// Kiểu dữ liệu học sinh
export interface StudentType {
    id?: string;
    avatar?: string;
    fullname?: string;
    birthday?: string;
    gender?: string;
    class?: string;
    address?: string;
    status?: string;
    timeUpdate?: string;
}

// Kiểu dữ liệu nguời dùng
export interface UserType {
    id?: number;
    role?: string;
    username?: string;
    password?: string;
}