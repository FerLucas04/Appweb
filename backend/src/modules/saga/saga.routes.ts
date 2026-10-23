import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { createSaga, deleteSaga, getSagaById, getSagas, updateSaga } from "./saga.controller.js";

const router = Router();

// todas las rutas del módulo son privadas
router.use(authenticateToken);

router.get("/", getSagas);
router.get("/:id", getSagaById);
router.post("/", createSaga);
router.put("/:id", updateSaga);
router.delete("/:id", deleteSaga);

export const sagaRouter = router;