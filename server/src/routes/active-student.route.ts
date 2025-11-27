import { Router } from "express";
import ActiveStudentController from "../controllers/active-student.controller";

const router = Router();

router.get("", ActiveStudentController.getAll)
router.post("", ActiveStudentController.create);
router.put("", ActiveStudentController.update);
router.put("/scan", ActiveStudentController.scan);

export default router;