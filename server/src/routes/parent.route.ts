import { Router } from "express";
import ParentController from "../controllers/parent.controller";
import { UploadMiddleware } from "../middlewares/upload.middleware";

const router = Router();
router.get("", ParentController.getAll);
router.get("/:id", ParentController.get);
router.post(
  "",
  UploadMiddleware("parents", "avatar"), 
  ParentController.create
);
router.put("/:id", UploadMiddleware("parents", "avatar"),ParentController.update);
// router.delete("/:id", ParentController.delete);

export default router;