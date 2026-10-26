export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const STORAGE_KEYS = {
  TOKEN: "library_token",
  USER: "library_user",
};

// Rutas del navegador
export const ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  BOOKS: "/books",
  MANAGEMENT: "/management",
  LOGS: "/logs",
};

// Endpoints del backend (relativos a API_URL). Los cuatro catálogos DEBEN estar acá.
export const ENDPOINTS = {
  LOGIN: "/auth/login",
  ME: "/auth/me",
  LOGS: "/logs",
  BOOKS: "/books",
  AUTHORS: "/authors",
  GENRES: "/genres",
  SHELVES: "/shelves",
  SAGAS: "/sagas",
};

// Evento global que api.js dispara cuando el backend responde 401
export const AUTH_EVENTS = {
  UNAUTHORIZED: "auth:unauthorized",
};

export const MESSAGES = {
  NETWORK_ERROR: "No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.",
  FORBIDDEN: "No tenés permisos para realizar esta acción.",
  UNEXPECTED: "Ocurrió un error inesperado. Intentá nuevamente.",
  EMAIL_REQUIRED: "El email es obligatorio",
  EMAIL_INVALID: "Ingresá un email válido",
  PASSWORD_REQUIRED: "La contraseña es obligatoria",
};