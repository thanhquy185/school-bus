import { Router } from "express";
import ActivePickupController from "../controllers/active-pickup.controller";

const router = Router();

router.get("", ActivePickupController.getAll)
router.post("", ActivePickupController.create);
router.put("", ActivePickupController.update);

export default router;