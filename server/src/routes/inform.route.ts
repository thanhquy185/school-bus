import { Router } from "express";
import InformController from "../controllers/inform.controller";

const router = Router();

router.get("", InformController.getAll)
router.get("/:id", InformController.getById);
router.post("", InformController.create);
router.put("/:id", InformController.update);
router.delete("/:id", InformController.delete);

export default router;