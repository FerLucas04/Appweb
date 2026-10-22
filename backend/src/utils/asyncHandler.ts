import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Envuelve un controlador async y redirige cualquier error al errorHandler.
 */
export const asyncHandler =
  (fn: AsyncController): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };