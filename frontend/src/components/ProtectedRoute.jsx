import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "../constants";
import { useAuth } from "../hooks/useAuth";

//"protector" de rutas. Si no hay sesión activa, redirige a login
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="center-screen">Verificando sesión…</div>;
  }

  if (!isAuthenticated) {
    // "from" permite volver a la página que se intentaba abrir después de loguearse
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};