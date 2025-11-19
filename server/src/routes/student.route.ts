import { Router } from "express";
import StudentController from "../controllers/student.controller";
import UploadMiddleware from "../middlewares/upfile.middware";

const router = Router();

router.get("/studying", StudentController.getAllStudying);
router.get("", StudentController.getAll);

router.post("", StudentController.create);
router.post("/:id/avatar",
  UploadMiddleware.single("avatar"),
  StudentController.uploadAvatar
);

router.put("/:id", StudentController.update);

export default router;