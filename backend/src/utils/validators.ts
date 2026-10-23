import type { Request } from "express";
import { AppError } from "../middlewares/errors.js";

/** En Express 5 req.body es undefined si no hay cuerpo. */
export const getBody = (req: Request): Record<string, unknown> =>
  typeof req.body === "object" && req.body !== null ? (req.body as Record<string, unknown>) : {};

const isEmpty = (v: unknown): boolean => v === undefined || v === null || v === "";

const toNumber = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && /^-?\d+$/.test(v.trim())) return Number(v);
  return NaN;
};

export const requiredString = (value: unknown, field: string, max: number): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw AppError.validation(`El campo "${field}" es obligatorio`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw AppError.validation(`El campo "${field}" no puede superar los ${max} caracteres`);
  }
  return trimmed;
};

export const optionalString = (value: unknown, field: string, max: number): string | null =>
  isEmpty(value) ? null : requiredString(value, field, max);

export const requiredInt = (value: unknown, field: string, min: number, max = 2_147_483_647): number => {
  const n = toNumber(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw AppError.validation(`El campo "${field}" debe ser un entero entre ${min} y ${max}`);
  }
  return n;
};

export const requiredId = (value: unknown, field: string): number => requiredInt(value, field, 1);

export const optionalId = (value: unknown, field: string): number | null =>
  isEmpty(value) ? null : requiredId(value, field);

/** Para filtros de query string: si no viene, devuelve undefined (no filtra). */
export const optionalQueryInt = (value: unknown, field: string, min = 1, max?: number): number | undefined =>
  isEmpty(value) ? undefined : requiredInt(value, field, min, max);

/** Id de la URL (/:id). */
export const parseId = (value: unknown): number => requiredId(value, "id");