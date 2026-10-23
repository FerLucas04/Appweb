import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { createShelf, deleteShelf, getShelfById, getShelves, updateShelf } from "./shelf.controller.js";

const router = Router();

// todas las rutas del módulo son privadas
router.use(authenticateToken);

router.get("/", getShelves);
router.get("/:id", getShelfById);
router.post("/", createShelf);
router.put("/:id", updateShelf);
router.delete("/:id", deleteShelf);

export const shelfRouter = router;