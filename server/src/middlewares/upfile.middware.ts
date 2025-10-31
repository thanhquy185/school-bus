import multer from "multer";

const UploadMiddleware = multer({
    storage: multer.memoryStorage(),
});

export default UploadMiddleware;