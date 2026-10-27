import { Link } from "react-router";
import { ROUTES } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import "./Home.css";

// Array de secciones con información para mostrar en la página de inicio
const SECTIONS = [
  {
    icon: "📖",
    title: "Catálogo de Libros",
    route: ROUTES.BOOKS,
    cta: "Ir al catálogo",
    items: [
      "Consultá los libros y filtrá por autor, género y año de publicación.",
      "Visualizá la ubicación física de cada libro en su estante.",
      "Dá de alta, editá y eliminá ejemplares.",
    ],
  },
  {
    icon: "🗂️",
    title: "Administración",
    route: ROUTES.MANAGEMENT,
    cta: "Ir a Administración",
    items: [
      "Gestioná los catálogos auxiliares desde una interfaz por pestañas.",
      "Autores, Géneros Literarios, Sagas y Estantes.",
      "Alta, edición y baja de cada registro.",
    ],
  },
  {
    icon: "🧾",
    title: "Logs del Sistema",
    route: ROUTES.LOGS,
    cta: "Ver los logs",
    items: [
      "Auditá los eventos, registros y errores generados por la aplicación.",
      "Filtrá por nivel de severidad: info, warn y error.",
      "Actualizá la vista manual o automáticamente.",
    ],
  },
];

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="home-hero">
        <p className="home-hero-eyebrow">Bienvenido{user?.nombre ? `, ${user.nombre}` : ""}</p>
        <h1>Sistema de Gestión de Biblioteca</h1>
        <p>Administrá el catálogo de libros, sus autores, géneros, sagas y la ubicación de cada ejemplar.</p>
      </section>

      <aside className="home-notice" role="note">
        <span className="home-notice-icon" aria-hidden="true">
          🔐
        </span>
        <div>
          <h2>Acceso de administrador único</h2>
          <p>
            Esta plataforma cuenta con un <strong>único usuario Administrador / Bibliotecario</strong> con acceso total
            al sistema. No hay registro de nuevos usuarios ni otros roles.
          </p>
        </div>
      </aside>

      <section aria-labelledby="home-guide-title">
        <h2 id="home-guide-title" className="home-section-title">
          ¿Qué podés hacer?
        </h2>
        <p className="muted" style={{ margin: "0.25rem 0 1rem" }}>
          Utilizá el menú de navegación superior o los accesos directos de abajo.
        </p>

        {/* Sección de tarjetas con accesos directos a las secciones principales */}
        <div className="home-grid">
          {SECTIONS.map((section) => (
            <article key={section.route} className="home-card">
              <div className="home-card-icon" aria-hidden="true">
                {section.icon}
              </div>
              <div>
                <h3>{section.title}</h3>
                <span className="home-card-route">{section.route}</span>
              </div>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link to={section.route} className="home-card-link">
                {section.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};