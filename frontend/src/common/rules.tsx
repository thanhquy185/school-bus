    // Kiểm tra trường bắt buộc
    export const ruleRequired = (message?: string) => ({
      required: true,
      message: message || "Trường nhập dữ liệu không được để trống !",
    });

    // Kiểm tra biển số xe
    export const ruleLicensePlate = (message?: string) => ({
      pattern: /^\d{2}[A-Z][-\s]?(?:\d{3}\.?\d{2}|\d{5})$/i,
      message: message || "Biển số xe không hợp lệ !",
    });

    // Kiểm tra email
    export const ruleEmail = (message?: string) => ({
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: message || "Email không hợp lệ !",
    });

    // Kiểm tra số điện thoại (10-11 chữ số)
    export const rulePhone = (message?: string) => ({
      pattern: /^0\d{9,10}$/,
      message: message || "Số điện thoại không hợp lệ !",
    });

    // Kiểm tra mật khẩu tối thiểu 8 ký tự
    export const rulePassword = (message?: string) => ({
      min: 8,
      message: message || "Mật khẩu phải ít nhất 8 ký tự !",
    });

    // Kiểm tra file ảnh .png
    export const ruleImagePng = (message?: string) => ({
      validator: (_: any, value: any[]) => {
        if (!value || value.length === 0) return Promise.resolve();
        console.log(value);
        const isPng = value.every((file: any) => {
          const name = file.name || file?.originFileObj?.name;
          return name?.toLowerCase().endsWith(".png");
        });
        return isPng
          ? Promise.resolve()
          : Promise.reject(new Error(message || "Chỉ được tải ảnh định dạng .png !"));
      },
    });

