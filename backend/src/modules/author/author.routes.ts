import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor } from "./author.controller.js";

const router = Router();

// todas las rutas del módulo son privadas
router.use(authenticateToken);

router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.post("/", createAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

export const authorRouter = router;