import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { login, me } from "./user.controller.js";

const router = Router();

router.post("/login", login);              // pública
router.get("/me", authenticateToken, me);  // privada: requiere JWT válido

export const authRouter = router;