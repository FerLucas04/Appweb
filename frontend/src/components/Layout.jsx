import { NavLink, Outlet } from "react-router";
import { ROUTES } from "../constants";
import { useAuth } from "../hooks/useAuth";

//barra superior con navegación, nombre del administrador 
//y un botón de cerrar sesión 

export const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="navbar">
        <strong> Biblioteca</strong>
        <nav>
          <NavLink to={ROUTES.HOME} end> Inicio </NavLink>
          <NavLink to={ROUTES.LOGS}>Logs</NavLink>
          <NavLink to={ROUTES.BOOKS}>Libros</NavLink>
          <NavLink to={ROUTES.MANAGEMENT}>Administración</NavLink>
        </nav>
        <div className="navbar-user">
          <span>{user?.nombre}</span>
          <button className="btn btn-secondary" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};