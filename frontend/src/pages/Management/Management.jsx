import { useState } from "react";
import { CatalogTab } from "../../components/CatalogTab";
import { createAuthor, deleteAuthor, getAuthors, updateAuthor } from "../../services/authors.service";
import { createGenre, deleteGenre, getGenres, updateGenre } from "../../services/genres.service";
import { createSaga, deleteSaga, getSagas, updateSaga } from "../../services/sagas.service";
import { createShelf, deleteShelf, getShelves, updateShelf } from "../../services/shelves.service";
import { authorSchema, genreSchema, sagaSchema, shelfSchema } from "../../utils/validators";
import "./Management.css";

// Fuera del componente para que las referencias sean estables entre renders.
// Cada entrada describe un catálogo completo: servicio, schema, campos del formulario y columnas.
const CATALOGS = {
  authors: {
    label: "Autores",
    singular: "autor",
    newLabel: "Nuevo autor",
    editLabel: "Editar autor",
    emptyMessage: "Todavía no hay autores cargados.",
    describe: (row) => row.nombre,
    service: { getAll: getAuthors, create: createAuthor, update: updateAuthor, remove: deleteAuthor },
    schema: authorSchema,
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "nacionalidad", label: "Nacionalidad (opcional)", type: "text" },
    ],
    columns: [
      { key: "nombre", header: "Nombre" },
      { key: "nacionalidad", header: "Nacionalidad" },
    ],
  },
  genres: {
    label: "Géneros",
    singular: "género",
    newLabel: "Nuevo género",
    editLabel: "Editar género",
    emptyMessage: "Todavía no hay géneros cargados.",
    describe: (row) => row.nombre,
    service: { getAll: getGenres, create: createGenre, update: updateGenre, remove: deleteGenre },
    schema: genreSchema,
    fields: [{ name: "nombre", label: "Nombre", type: "text" }],
    columns: [{ key: "nombre", header: "Nombre" }],
  },
  sagas: {
    label: "Sagas",
    singular: "saga",
    newLabel: "Nueva saga",
    editLabel: "Editar saga",
    emptyMessage: "Todavía no hay sagas cargadas.",
    describe: (row) => row.nombre,
    service: { getAll: getSagas, create: createSaga, update: updateSaga, remove: deleteSaga },
    schema: sagaSchema,
    fields: [{ name: "nombre", label: "Nombre", type: "text" }],
    columns: [{ key: "nombre", header: "Nombre" }],
  },
  shelves: {
    label: "Estantes",
    singular: "estante",
    newLabel: "Nuevo estante",
    editLabel: "Editar estante",
    emptyMessage: "Todavía no hay estantes cargados.",
    describe: (row) => row.codigo,
    service: { getAll: getShelves, create: createShelf, update: updateShelf, remove: deleteShelf },
    schema: shelfSchema,
    fields: [
      { name: "codigo", label: "Código o ubicación (ej. Estante A-1)", type: "text" },
      { name: "descripcion", label: "Descripción (opcional)", type: "text" },
    ],
    columns: [
      { key: "codigo", header: "Código" },
      { key: "descripcion", header: "Descripción" },
    ],
  },
};

export const Management = () => {
  const [active, setActive] = useState("authors");

  return (
    <div className="card mgmt-page">
      <div>
        <h1>Administración de catálogos</h1>
        <p className="mgmt-subtitle muted">Gestioná los autores, géneros, sagas y estantes que usan los libros.</p>
      </div>

      <div className="mgmt-tabs" role="tablist" aria-label="Catálogos">
        {Object.entries(CATALOGS).map(([key, cfg]) => (
          <button
            key={key}
            role="tab"
            aria-selected={active === key}
            className={`mgmt-tab ${active === key ? "mgmt-tab--active" : ""}`}
            onClick={() => setActive(key)}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* key reinicia el estado de la pestaña al cambiar de catálogo */}
      <div className="mgmt-panel" role="tabpanel">
        <CatalogTab key={active} config={CATALOGS[active]} />
      </div>
    </div>
  );
};