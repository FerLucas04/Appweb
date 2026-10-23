import { useAuth } from "../hooks/useAuth";

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="card">
      <h1>Bienvenido, {user?.nombre}</h1>
      <p className="muted">
        Sesión iniciada como {user?.email}. Los módulos de libros, autores, géneros, estantes y sagas se
        agregarán en los próximos pasos.
      </p>
    </div>
  );
};