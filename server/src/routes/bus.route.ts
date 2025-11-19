import { Router } from "express";
import BusController from "../controllers/bus.controller";

const router = Router();

router.get("/active", BusController.getAllActive);
router.get("/", BusController.getAll);
router.post("/", BusController.create);
router.put("/:id", BusController.update);

export default router;