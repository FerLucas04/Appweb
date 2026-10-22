import type { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import {
  ERROR_CODES,
  HTTP_STATUS,
  IS_PRODUCTION,
  MESSAGES,
  type ErrorCode,
} from "../constants/index.js";
import { logger } from "../utils/logger.js";

/**
 * Error operacional: lo lanzamos nosotros a propósito (ej. "libro no encontrado").
 * Ejemplo: throw new AppError(404, "Libro no encontrado", ERROR_CODES.NOT_FOUND);
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    code: ErrorCode = ERROR_CODES.INTERNAL_ERROR,
    details?: unknown,
    isOperational = true,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  //Metodos estaticos de error por defecto
  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.BAD_REQUEST, message, ERROR_CODES.BAD_REQUEST, details);
  }

  static validation(message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.BAD_REQUEST, message, ERROR_CODES.VALIDATION_ERROR, details);
  }

  static unauthorized(message = "No autorizado", details?: unknown): AppError {
    return new AppError(HTTP_STATUS.UNAUTHORIZED, message, ERROR_CODES.UNAUTHORIZED, details);
  }

  static forbidden(message = "Acceso denegado", details?: unknown): AppError {
    return new AppError(HTTP_STATUS.FORBIDDEN, message, ERROR_CODES.FORBIDDEN, details);
  }

  static notFound(message = "Recurso no encontrado", details?: unknown): AppError {
    return new AppError(HTTP_STATUS.NOT_FOUND, message, ERROR_CODES.NOT_FOUND, details);
  }

  static conflict(message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.CONFLICT, message, ERROR_CODES.CONFLICT, details);
  }
}

/** Convierte cualquier error conocido en un AppError uniforme. */
const normalizeError = (err: unknown): AppError => {
  if (err instanceof AppError) return err;

  // JSON mal formado en el body (lo lanza express.json())
  if (err instanceof SyntaxError && "body" in err) {
    return new AppError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_JSON, ERROR_CODES.BAD_REQUEST);
  }

  // Violación de unicidad en MySQL (ej. email o ISBN repetido)
  if (err instanceof QueryFailedError) {
    const driverCode = (err.driverError as { code?: string } | undefined)?.code;
    if (driverCode === "ER_DUP_ENTRY") {
      return new AppError(HTTP_STATUS.CONFLICT, MESSAGES.DUPLICATE_ENTRY, ERROR_CODES.CONFLICT);
    }
  }

  // Error inesperado: no exponemos detalles internos al cliente
  return new AppError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    MESSAGES.INTERNAL_ERROR,
    ERROR_CODES.INTERNAL_ERROR,
    undefined,
    false,
  );
};

/** 404 para rutas inexistentes. Se registra después de todas las rutas. */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError(
      HTTP_STATUS.NOT_FOUND,
      MESSAGES.ROUTE_NOT_FOUND(req.method, req.originalUrl),
      ERROR_CODES.NOT_FOUND,
    ),
  );
};

/** Manejador central: Express lo reconoce por tener 4 parámetros. */
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const appError = normalizeError(err);
  const context = `${req.method} ${req.originalUrl} -> ${appError.message}`;

  if (appError.statusCode >= 500) logger.error(context, err);
  else logger.warn(context);

  res.status(appError.statusCode).json({
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details !== undefined && { details: appError.details }),
      ...(!IS_PRODUCTION && { stack: err instanceof Error ? err.stack : appError.stack }),
    },
  });
};