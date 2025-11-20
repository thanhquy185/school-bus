import { Router } from "express";
import ParentController from "../controllers/parent.controller";
import UploadMiddleware from "../middlewares/upfile.middware";

const router = Router();

router.get("/active", ParentController.getAllActive);
router.get("", ParentController.getAll);
router.post("", ParentController.create);
router.post("/:id/avatar", 
  UploadMiddleware.single("avatar"), 
  ParentController.uploadAvatar
);
router.put("/:id", ParentController.update);
router.get("/info", ParentController.getInfo);
router.get("/students", ParentController.getStudents);

export default router;