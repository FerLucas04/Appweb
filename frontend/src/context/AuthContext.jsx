import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { AUTH_EVENTS, ENDPOINTS, STORAGE_KEYS } from "../constants";
import { api } from "../services/api";

//Conexto global de autenticación. 
//Provee el estado de sesión y funciones para loguearse y desloguearse.

export const AuthContext = createContext(undefined);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [user, setUser] = useState(readStoredUser);
  // true mientras se verifica con el backend un token guardado al abrir la app
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem(STORAGE_KEYS.TOKEN)));

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  }, []);

  // Verificación de sesión al abrir la app: valida el token guardado contra GET /auth/me
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.TOKEN)) return;

    let cancelled = false;
    api
      .get(ENDPOINTS.ME)
      .then(({ data }) => {
        if (cancelled) return;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        // Si fue un 401, el interceptor ya limpió la sesión y disparó el evento.
        // Si fue un error de red, se conserva la sesión y se reintenta en la próxima petición.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // El interceptor de Axios avisa cuando el backend rechaza el token
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    return () => window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(token && user), isLoading, login, logout }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};