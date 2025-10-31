import { Request, Response, NextFunction } from "express";
import multer from "multer";

// Middleware đơn giản để xử lý file upload
export const FileUploadMiddleware = multer({
  storage: multer.memoryStorage(),// Lưu trong RAM để upl oad lên Firebase
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'));
    }
  }
});

// Middleware để xử lý lỗi upload
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn! Tối đa 5MB'
      });
    }
  }
  
  if (err.message === 'Chỉ chấp nhận file ảnh!') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};
