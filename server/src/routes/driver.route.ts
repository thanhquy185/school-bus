import { Router } from "express";
import DriverController from "../controllers/driver.controller";
import UploadMiddleware from "../middlewares/upfile.middware";


const route = Router();

route.get("/all-active", DriverController.getAllActive);
route.get("", DriverController.getAll);
route.post("", DriverController.create);
route.post(
    "/:id/avatar",
    UploadMiddleware.single("avatar"),
    DriverController.uploadAvatar
);
route.put("/:id", DriverController.update);
route.get("/active", DriverController.getActive);
route.get("/active-for-schedule", DriverController.getActiveForSchedule);
route.get("/schedules", DriverController.getSchedules);
route.get("/info", DriverController.getInfo);

export default route;