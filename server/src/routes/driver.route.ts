import { Router } from "express";
import DriverController from "../controllers/driver.controller";
import UploadMiddleware from "../middlewares/upfile.middware";


const route = Router();

route.get("/active", DriverController.getAllActive);
route.get("", DriverController.getAll);
route.post("", DriverController.create);
route.post(
    "/:id/avatar",
    UploadMiddleware.single("avatar"),
    DriverController.uploadAvatar
);

route.put("/:id", DriverController.update);

export default route;