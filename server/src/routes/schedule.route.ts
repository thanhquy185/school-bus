import { Router } from "express";
import ScheduleController from "../controllers/schedule.controller";

const router = Router();

router.get("/active", ScheduleController.getAllActive)
router.get("", ScheduleController.getAll)
router.get("/:id", ScheduleController.get);
router.post("", ScheduleController.create);
router.put("/:id", ScheduleController.update);
router.delete("/:id", ScheduleController.delete);

export default router;