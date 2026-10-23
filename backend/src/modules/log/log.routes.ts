import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { getLogs } from "./log.controller.js";

const router = Router();

router.use(authenticateToken);
router.get("/", getLogs); // ?level=warn&limit=50

export const logRouter = router;