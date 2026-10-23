import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Alert } from "../components/Alert";
import { BookDetailModal } from "../components/BookDetailModal";
import { BookFilter } from "../components/BookFilter";
import { ConfirmModal } from "../components/ConfirmModal";
import { EntityForm } from "../components/EntityForm";
import { Loading } from "../components/Loading";
import { Modal } from "../components/Modal";
import { Table } from "../components/Table";
import { ROUTES } from "../constants";
import { getAuthors } from "../services/authors.service";
import { getErrorMessage } from "../services/api";
import { createBook, deleteBook, getBooks, updateBook } from "../services/books.service";
import { getGenres } from "../services/genres.service";
import { getSagas } from "../services/sagas.service";
import { getShelves } from "../services/shelves.service";
import { bookSchema } from "../utils/validators";

const toOptions = (list, labelKey) => list.map((item) => ({ value: item.id, label: item[labelKey] }));

const COLUMNS = [
  { key: "titulo", header: "Título" },
  { key: "autor", header: "Autor", render: (b) => b.autor?.nombre },
  { key: "genero", header: "Género", render: (b) => b.genero?.nombre },
  { key: "anioPublicacion", header: "Año" },
  { key: "estante", header: "Estante", render: (b) => b.estante?.codigo },
  { key: "saga", header: "Saga", render: (b) => b.saga?.nombre ?? "—" },
];

export const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [catalogs, setCatalogs] = useState({ authors: [], genres: [], shelves: [], sagas: [] });
  const [catalogsReady, setCatalogsReady] = useState(false);
  const [catalogsError, setCatalogsError] = useState(null);

  const [filters, setFilters] = useState({});
  const [reloadKey, setReloadKey] = useState(0);

  // undefined = modal cerrado, null = alta, objeto = edición
  const [formBook, setFormBook] = useState(undefined);
  const [detailId, setDetailId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Catálogos para los desplegables (filtros y formulario)
  useEffect(() => {
    let cancelled = false;
    Promise.all([getAuthors(), getGenres(), getShelves(), getSagas()])
      .then(([authors, genres, shelves, sagas]) => {
        if (!cancelled) {
          setCatalogs({ authors, genres, shelves, sagas });
          setCatalogsReady(true);
        }
      })
      .catch((err) => {
        if (!cancelled) setCatalogsError(getErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Libros: se recargan al cambiar los filtros o después de crear/editar/borrar
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBooks(filters)
      .then((data) => {
        if (!cancelled) {
          setBooks(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, reloadKey]);

  const bookFields = useMemo(
    () => [
      { name: "titulo", label: "Título", type: "text" },
      { name: "anioPublicacion", label: "Año de publicación", type: "number" },
      { name: "autorId", label: "Autor", type: "select", options: toOptions(catalogs.authors, "nombre") },
      { name: "generoId", label: "Género", type: "select", options: toOptions(catalogs.genres, "nombre") },
      { name: "estanteId", label: "Estante", type: "select", options: toOptions(catalogs.shelves, "codigo") },
      {
        name: "sagaId",
        label: "Saga (opcional)",
        type: "select",
        emptyLabel: "Sin saga",
        options: toOptions(catalogs.sagas, "nombre"),
      },
    ],
    [catalogs],
  );

  const canCreate = catalogs.authors.length > 0 && catalogs.genres.length > 0 && catalogs.shelves.length > 0;
  const reload = () => setReloadKey((k) => k + 1);

  const handleSave = async (data) => {
    if (formBook) {
      await updateBook(formBook.id, data);
      setNotice("Libro actualizado correctamente");
    } else {
      await createBook(data);
      setNotice("Libro creado correctamente");
    }
    setFormBook(undefined);
    reload();
  };

  const handleDelete = async () => {
    await deleteBook(deleteTarget.id);
    setDeleteTarget(null);
    setNotice("Libro eliminado correctamente");
    reload();
  };

  return (
    <div className="card">
      <div className="page-header">
        <h1>Catálogo de libros</h1>
        <button
          className="btn"
          style={{ marginTop: 0 }}
          disabled={!canCreate}
          onClick={() => setFormBook(null)}
        >
          + Nuevo libro
        </button>
      </div>

      {catalogsError && <Alert type="error">{catalogsError}</Alert>}
      {catalogsReady && !canCreate && (
        <Alert type="info">
          Para cargar libros primero necesitás al menos un autor, un género y un estante. Creálos en{" "}
          <Link to={ROUTES.MANAGEMENT}>Administración</Link>.
        </Alert>
      )}

      <BookFilter authors={catalogs.authors} genres={catalogs.genres} onApply={setFilters} />

      {notice && (
        <Alert type="success" onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      )}
      {error && <Alert type="error">{error}</Alert>}
      {loading && <Loading />}

      {!loading && !error && (
        <Table
          columns={COLUMNS}
          data={books}
          emptyMessage="No se encontraron libros con esos criterios."
          renderActions={(book) => (
            <div className="row-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setDetailId(book.id)}>
                Ver
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setFormBook(book)}>
                Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(book)}>
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {formBook !== undefined && (
        <Modal title={formBook ? "Editar libro" : "Nuevo libro"} onClose={() => setFormBook(undefined)}>
          <EntityForm
            fields={bookFields}
            schema={bookSchema}
            initialValues={formBook ?? {}}
            onSubmit={handleSave}
            onCancel={() => setFormBook(undefined)}
          />
        </Modal>
      )}

      {detailId !== null && <BookDetailModal bookId={detailId} onClose={() => setDetailId(null)} />}

      {deleteTarget && (
        <ConfirmModal
          title="Eliminar libro"
          message={`¿Eliminar el libro "${deleteTarget.titulo}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};