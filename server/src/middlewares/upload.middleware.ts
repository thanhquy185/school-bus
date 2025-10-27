import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { RestResponse } from "../responses/rest.response";
import { BAD_CODE, BAD_MESSAGE } from "../configs/respose.config";

export const UploadMiddleware = (folderName: string, fieldName: string) => {
  // 📁 Tạo thư mục đích (vd: uploads/parents)
  const uploadDir = path.join(__dirname, `../../uploads/${folderName}`);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // ⚙️ Cấu hình multer
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("File không hợp lệ. Chỉ chấp nhận ảnh!"));
      }
      cb(null, true);
    },
  }).single(fieldName);

  return async (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: any) => {
      if (err) {
        const response: RestResponse = {
          statusCode: BAD_CODE,
          result: false,
          message: BAD_MESSAGE,
          data: null,
          errorMessage: err.message,
        };
        return res.status(response.statusCode).json(response);
      }
      next();
    });
  };
};
