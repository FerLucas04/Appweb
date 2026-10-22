import "dotenv/config";

/** Lee una variable de entorno obligatoria; si falta, el servidor no arranca. */
const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
  }
  return value;
};

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: Number(process.env.DB_PORT ?? 3306),
  DB_USER: required("DB_USER"),
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  DB_NAME: required("DB_NAME"),
  JWT_SECRET: required("JWT_SECRET"),
  ADMIN_PASSWORD: required("ADMIN_PASSWORD"),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL?.trim() || "admin@biblioteca.com",
  ADMIN_NOMBRE: process.env.ADMIN_NOMBRE?.trim() || "Administrador",
} as const;

export const IS_PRODUCTION = ENV.NODE_ENV === "production";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const MESSAGES = {
  INTERNAL_ERROR: "Error interno del servidor",
  INVALID_JSON: "El cuerpo de la petición no es un JSON válido",
  DUPLICATE_ENTRY: "Ya existe un registro con esos datos",
  ROUTE_NOT_FOUND: (method: string, url: string) => `Ruta no encontrada: ${method} ${url}`,
} as const;

export const BCRYPT_SALT_ROUNDS = 10;
export const JWT_EXPIRES_IN = "8h";