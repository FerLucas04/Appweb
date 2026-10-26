import { NavLink, Outlet } from "react-router";
import { ROUTES } from "../constants";
import { useAuth } from "../hooks/useAuth";

//Barra de navegación superior y contenedor principal 
//para las páginas privadas. Se usa en App.jsx.
export const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="navbar">
        <strong className="navbar-brand"> Biblioteca</strong>
        <nav className="navbar-links">
          <NavLink to={ROUTES.HOME} end>
            Inicio
          </NavLink>
          <NavLink to={ROUTES.BOOKS}>Libros</NavLink>
          <NavLink to={ROUTES.MANAGEMENT}>Administración</NavLink>
          <NavLink to={ROUTES.LOGS}>Logs</NavLink>
        </nav>
        <div className="navbar-user">
          <span>{user?.nombre}</span>
          <button className="btn btn-secondary btn-sm" onClick={logout}>
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