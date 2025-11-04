// Điều kiện kiểm tra trường phải được nhập
export const ruleRequired = (message?: string) => {
  return {
    required: true,
    message: message! ? message : "Trường nhập dữ liệu không được để trống !",
  };
};

// Điều kiện kiểm tra email
export const ruleEmail = (message?: string) => {
  return {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: message! ? message : "Email không hợp lệ !",
  };
};

// Điều kiện kiểm tra số điện thoại
export const rulePhone = (message?: string) => {
  return {
    pattern: /^\d{10,11}$/,
    message: message! ? message : "Số điện thoại phải có 10 hoặc 11 chữ số !",
  };
};

// Điều kiện kiểm tra nhập mật khẩu đủ kí tự
export const rulePassword = (message?: string) => {
  return {
    required: true,
    min: 6,
    message: message ? message : "Nhập mật khẩu ít nhất 6 kí tự",
  };
};
