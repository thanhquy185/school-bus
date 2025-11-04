import { Router } from "express";
import ClassController from "../controllers/class.controller";

const router = Router();

router.get("", ClassController.getList);
router.post("", ClassController.create);

export default router;