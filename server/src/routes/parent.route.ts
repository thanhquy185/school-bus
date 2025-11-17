import { Router } from "express";
import ParentController from "../controllers/parent.controller";
import UploadMiddleware from "../middlewares/upfile.middware";

const router = Router();
router.get("", ParentController.getList);
router.post("", ParentController.create);
router.post("/:id/avatar", 
  UploadMiddleware.single("avatar"), 
  ParentController.uploadAvatar
);

router.put("/:id", ParentController.update);

/**
 * @Routers used by parent, verify by JWT
 */
router.get("/student", ParentController.getStudents);
router.get("/pickup", ParentController.getPickups);

router.put("/student/:id/pickup", ParentController.updatePickupStudent);

export default router;