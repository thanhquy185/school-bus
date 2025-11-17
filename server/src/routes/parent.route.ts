import { Router } from "express";
import ParentController from "../controllers/parent.controller";
import UploadMiddleware from "../middlewares/upfile.middware";

const router = Router();
router.get("", ParentController.getList);
router.get("/account/:id", ParentController.getByAccountId);
router.post("", ParentController.create);
router.post("/:id/avatar", 
  UploadMiddleware.single("avatar"), 
  ParentController.uploadAvatar
);

router.put("/:id", ParentController.update);

export default router;