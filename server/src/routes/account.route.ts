import { Router } from "express";
import AccountController from "../controllers/account.controller";

const router = Router();

router.get("/:id", AccountController.get);
router.post("", AccountController.create);
router.put("/:id", AccountController.update);
router.delete("/:id", AccountController.delete);

export default router;