import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "./book.controller.js";

const router = Router();

// todas las rutas del módulo son privadas
router.use(authenticateToken);

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export const bookRouter = router;