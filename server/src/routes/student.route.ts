import { Router } from "express";
import StudentController from "../controllers/student.controller";
import UploadMiddleware from "../middlewares/upfile.middware";

const router = Router();

router.get("", StudentController.getList);
router.post("", UploadMiddleware.single("avatar"), StudentController.create);

export default router;