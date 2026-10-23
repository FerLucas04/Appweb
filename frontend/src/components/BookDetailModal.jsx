import { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";
import { getBookById } from "../services/books.service";
import { Alert } from "./Alert";
import { Loading } from "./Loading";
import { Modal } from "./Modal";

/** Pide el libro por id al backend y muestra autor, género, saga y estante. */
export const BookDetailModal = ({ bookId, onClose }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getBookById(bookId)
      .then((data) => {
        if (!cancelled) setBook(data);
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
  }, [bookId]);

  return (
    <Modal title="Detalle del libro" onClose={onClose}>
      {loading && <Loading />}
      {error && <Alert type="error">{error}</Alert>}

      {book && (
        <dl className="detail-list">
          <dt>Título</dt>
          <dd>
            <strong>{book.titulo}</strong>
          </dd>

          <dt>Año</dt>
          <dd>{book.anioPublicacion}</dd>

          <dt>Autor</dt>
          <dd>
            {book.autor.nombre}
            {book.autor.nacionalidad && <span className="muted"> ({book.autor.nacionalidad})</span>}
          </dd>

          <dt>Género</dt>
          <dd>{book.genero.nombre}</dd>

          <dt>Saga</dt>
          <dd>{book.saga ? book.saga.nombre : <span className="muted">Sin saga</span>}</dd>

          <dt>Ubicación</dt>
          <dd className="detail-shelf">
              <strong>{book.estante.codigo}</strong>
            {book.estante.descripcion && <div className="muted">{book.estante.descripcion}</div>}
          </dd>
        </dl>
      )}

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
};