import type { NextFunction, Request, Response } from "express";
import { authService, type PublicUser } from "../modules/user/user.service.js";
import { AppError } from "./errors.js";

//declare global permite ampliar las declaraciones de tipos que existen globalmente
//Agrega `user` al tipo Request de Express (Express.Request) para poder usar req.user
declare global {
  namespace Express {
    interface Request { //indica que propiedad nueva tendra el objeto Request
      user?: PublicUser; //? indica que la propiedad es opcional
    }
  }
}

//Middleware que verifica el token
export const authenticateToken = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header) {
    throw AppError.unauthorized("Token de autenticación no proporcionado");
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw AppError.unauthorized("Formato inválido. Use: Authorization: Bearer <token>");
  }

  // Si el token es válido, agrega la información del usuario a req.user
  req.user = authService.verifyToken(token);
  next();
};