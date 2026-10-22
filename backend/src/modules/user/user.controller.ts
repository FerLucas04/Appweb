import { HTTP_STATUS } from "../../constants/index.js";
import { AppError } from "../../middlewares/errors.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authService } from "./user.service.js";

export const login = asyncHandler(async (req, res) => {
  // En Express 5 req.body es undefined si la petición no trae cuerpo
  const { email, password } = (req.body ?? {}) as { email?: unknown; password?: unknown };

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    throw AppError.validation("El email y la contraseña son obligatorios");
  }

  const result = await authService.login(email, password);
  res.status(HTTP_STATUS.OK).json(result); // { token, user: { id, email, nombre } }
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) throw AppError.unauthorized("Token inválido o expirado");

  const user = await authService.getProfile(req.user.id);
  res.status(HTTP_STATUS.OK).json({ user });
});