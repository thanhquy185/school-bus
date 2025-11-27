import { Router } from "express";
import ParentController from "../controllers/parent.controller";
import UploadMiddleware from "../middlewares/upfile.middware";

const router = Router();

router.get("/all-active", ParentController.getAllActive);
router.get("", ParentController.getAll);
router.post("", ParentController.create);
router.post("/:id/avatar", 
  UploadMiddleware.single("avatar"), 
  ParentController.uploadAvatar
);
router.put("/:id", ParentController.update);
router.get("/active-by-student/:id", ParentController.getActiveByStudent);
router.get("/students", ParentController.getStudents);
router.get("/info", ParentController.getInfo);

export default router;