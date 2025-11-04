import { Router } from "express";
import DriverController from "../controllers/driver.controller";
import UploadMiddleware from "../middlewares/upfile.middware";

const router = Router();

router.get("/:id", DriverController.get);
router.get("", DriverController.getList);
router.post("", DriverController.create);
router.put("/:id", DriverController.update);
router.delete("/:id", DriverController.deleteDriver);
router.post(
  "/:id/avatar",
  UploadMiddleware.single("avatar"),
  DriverController.uploadAvatar
);

export default router;
