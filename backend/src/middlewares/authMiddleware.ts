import type { NextFunction, Request, Response } from "express";
import { authService, type PublicUser } from "../modules/user/user.service.js";
import { AppError } from "./errors.js";

// Agrega `user` al tipo Request de Express para poder usar req.user con tipos
declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

export const authenticateToken = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header) {
    throw AppError.unauthorized("Token de autenticación no proporcionado");
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw AppError.unauthorized("Formato inválido. Use: Authorization: Bearer <token>");
  }

  // Lanza AppError.unauthorized("Token inválido o expirado") si la firma o la fecha fallan
  req.user = authService.verifyToken(token);
  next();
};