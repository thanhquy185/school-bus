import { Router } from "express";
import BusController from "../controllers/bus.controller";

const router = Router();

router.post("/", BusController.create);
router.put("/:id", BusController.update);
router.get("/", BusController.getAll);

export default router;