import { Router } from "express";
import DriverController from "../controllers/driver.controller";

const router = Router();

router.get("/:id", DriverController.getDriver);
router.get("", DriverController.getAllDrivers);
router.post("", DriverController.createDriver);
router.put("/:id", DriverController.updateDriver);
router.delete("/:id", DriverController.deleteDriver);

export default router;
