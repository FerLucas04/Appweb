import axios from "axios";
import { API_URL, AUTH_EVENTS, ENDPOINTS, MESSAGES, STORAGE_KEYS } from "../constants";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request: adjunta el JWT guardado en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: 401 → sesión inválida o expirada
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // En el login, un 401 solo significa "credenciales incorrectas": no es sesión expirada
      const isLoginRequest = error.config?.url === ENDPOINTS.LOGIN;
      if (!isLoginRequest) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        // AuthContext escucha este evento y limpia su estado; ProtectedRoute redirige a /login
        window.dispatchEvent(new Event(AUTH_EVENTS.UNAUTHORIZED));
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Extrae un mensaje legible de cualquier error de Axios o del backend.
 * El backend responde errores con la forma { success: false, error: { code, message } }.
 */
export const getErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) return MESSAGES.NETWORK_ERROR;
    if (error.response.status === 403) return MESSAGES.FORBIDDEN;
    return error.response.data?.error?.message ?? MESSAGES.UNEXPECTED;
  }
  return MESSAGES.UNEXPECTED;
};