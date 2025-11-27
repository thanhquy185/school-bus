import { Router } from "express";
import ActiveController from "../controllers/active.controller";

const router = Router();

router.get("/all-active", ActiveController.getAllActive)
router.get("", ActiveController.getAll)
router.get("/:id", ActiveController.getById);
router.post("", ActiveController.create);
router.put("/:id", ActiveController.update);

export default router;