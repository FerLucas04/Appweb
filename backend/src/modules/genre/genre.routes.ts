import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { createGenre, deleteGenre, getGenreById, getGenres, updateGenre } from "./genre.controller.js";

const router = Router();

// todas las rutas del módulo son privadas
router.use(authenticateToken);

router.get("/", getGenres);
router.get("/:id", getGenreById);
router.post("/", createGenre);
router.put("/:id", updateGenre);
router.delete("/:id", deleteGenre);

export const genreRouter = router;