import { Router } from "express";
import RouteController from "../controllers/route.controller";

const router = Router();

router.get("/all-active", RouteController.getAllActive)
router.get("", RouteController.getAll)
router.get("/:id", RouteController.get);
router.post("", RouteController.create);
router.put("/:id", RouteController.update);
router.delete("/:id", RouteController.delete);


export default router;