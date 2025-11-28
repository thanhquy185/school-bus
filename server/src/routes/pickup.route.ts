import { Router } from "express";
import PickupController from "../controllers/pickup.controller";

const router = Router();

router.get("/all-active", PickupController.getAllActive)
router.get("", PickupController.getAll)
router.get("/:id", PickupController.get);
router.post("", PickupController.create);
router.put("/:id", PickupController.update);
router.delete("/:id", PickupController.delete);

export default router;