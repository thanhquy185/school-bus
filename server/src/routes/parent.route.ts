import { Router } from "express";
import ParentController from "../controllers/parent.controller";

const router = Router();
router.get("", ParentController.getAll);
router.get("/:id", ParentController.get);
router.post("", ParentController.create);
router.put("/:id", ParentController.update);
// router.delete("/:id", ParentController.delete);

export default router;