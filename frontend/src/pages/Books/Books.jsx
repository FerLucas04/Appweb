import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Alert } from "../../components/Alert";
import { BookDetailModal } from "../../components/BookDetailModal";
import { BookFilter } from "../../components/BookFilter";
import { BookFormModal } from "../../components/BookFormModal";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Loading } from "../../components/Loading";
import { Table } from "../../components/Table";
import { ROUTES } from "../../constants";
import { getErrorMessage } from "../../services/api";
import { getAuthors } from "../../services/authors.service";
import { deleteBook, getBookById, getBooks } from "../../services/books.service";
import { getGenres } from "../../services/genres.service";
import { getSagas } from "../../services/sagas.service";
import { getShelves } from "../../services/shelves.service";
import "./Books.css";

const COLUMNS = [
  { key: "titulo", header: "Título" },
  { key: "autor", header: "Autor", render: (b) => b.autor?.nombre },
  { key: "genero", header: "Género", render: (b) => b.genero?.nombre },
  { key: "anioPublicacion", header: "Año" },
  { key: "estante", header: "Estante", render: (b) => b.estante?.codigo },
  { key: "saga", header: "Saga", render: (b) => b.saga?.nombre ?? "—" },
];

export const Books = () => {
  // Listado
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [filters, setFilters] = useState({});
  const [reloadKey, setReloadKey] = useState(0);

  // Catálogos auxiliares (filtros y desplegables del formulario)
  const [catalogs, setCatalogs] = useState({ authors: [], genres: [], shelves: [], sagas: [] });
  const [catalogsReady, setCatalogsReady] = useState(false);
  const [catalogsError, setCatalogsError] = useState(null);

  // Modales. formBook: undefined = cerrado, null = alta, objeto = edición
  const [formBook, setFormBook] = useState(undefined);
  const [detailBook, setDetailBook] = useState(null);
  const [detailLoadingId, setDetailLoadingId] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Catálogos: una vez al montar
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

  // Libros: al montar, al cambiar los filtros y después de crear/editar/borrar
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

  const reload = () => setReloadKey((k) => k + 1);

  const canCreate = catalogs.authors.length > 0 && catalogs.genres.length > 0 && catalogs.shelves.length > 0;

  // Motivo por el que "Nuevo Libro" está deshabilitado (se muestra como tooltip)
  let newBookBlockedReason;
  if (catalogsError) newBookBlockedReason = "No se pudieron cargar los catálogos";
  else if (!catalogsReady) newBookBlockedReason = "Cargando catálogos…";
  else if (!canCreate) newBookBlockedReason = "Primero creá al menos un autor, un género y un estante";

  const handleView = async (book) => {
    setDetailError(null);
    setDetailLoadingId(book.id);
    try {
      setDetailBook(await getBookById(book.id));
    } catch (err) {
      setDetailError(getErrorMessage(err));
    } finally {
      setDetailLoadingId(null);
    }
  };

  const handleSaved = (message) => {
    setFormBook(undefined);
    setNotice(message);
    reload();
  };

  const handleDelete = async () => {
    await deleteBook(deleteTarget.id); // si falla, ConfirmModal muestra el error
    setDeleteTarget(null);
    setNotice("Libro eliminado correctamente");
    reload();
  };

  return (
    <div className="card books-page">
      <div className="page-header">
        <div>
          <h1>Catálogo de libros</h1>
          <p className="books-subtitle muted">Buscá, consultá y administrá los libros de la biblioteca.</p>
        </div>
        <button
          className="btn"
          disabled={Boolean(newBookBlockedReason)}
          title={newBookBlockedReason}
          onClick={() => setFormBook(null)}
        >
          + Nuevo Libro
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
      {detailError && (
        <Alert type="error" onClose={() => setDetailError(null)}>
          {detailError}
        </Alert>
      )}
      {loading && <Loading message="Cargando libros…" />}

      {!loading && !error && (
        <>
          <p className="books-summary">{books.length} libro(s) encontrado(s)</p>
          <Table
            columns={COLUMNS}
            data={books}
            emptyMessage="No se encontraron libros con esos criterios."
            renderActions={(book) => (
              <div className="row-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleView(book)}
                  disabled={detailLoadingId === book.id}
                >
                  {detailLoadingId === book.id ? "Cargando…" : "Ver Detalle"}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setFormBook(book)}
                  disabled={!catalogsReady}
                  title={!catalogsReady ? (catalogsError ?? "Cargando catálogos…") : undefined}
                >
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(book)}>
                  Eliminar
                </button>
              </div>
            )}
          />
        </>
      )}

      {formBook !== undefined && (
        <BookFormModal
          book={formBook}
          authors={catalogs.authors}
          genres={catalogs.genres}
          shelves={catalogs.shelves}
          sagas={catalogs.sagas}
          onSaved={handleSaved}
          onClose={() => setFormBook(undefined)}
        />
      )}

      {detailBook && <BookDetailModal book={detailBook} onClose={() => setDetailBook(null)} />}

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