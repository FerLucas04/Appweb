import { Modal } from "./Modal";

/**
 * Ficha de un libro. Recibe el libro ya cargado (con autor, genero, estante y saga poblados).
 */
export const BookDetailModal = ({ book, onClose }) => (
  <Modal title="Detalle del libro" onClose={onClose}>
    <h3 style={{ margin: "0 0 1rem" }}>{book.titulo}</h3>

    <dl className="detail-list">
      <dt>Año de publicación</dt>
      <dd>{book.anioPublicacion}</dd>

      <dt>Autor</dt>
      <dd>
        {book.autor.nombre}
        {book.autor.nacionalidad && <span className="muted"> ({book.autor.nacionalidad})</span>}
      </dd>

      <dt>Género</dt>
      <dd>{book.genero.nombre}</dd>

      <dt>Saga</dt>
      <dd>{book.saga ? book.saga.nombre : <span className="muted">No pertenece a ninguna saga</span>}</dd>

      <dt>Estante (ubicación física)</dt>
      <dd className="detail-shelf">
        📍 <strong>{book.estante.codigo}</strong>
        {book.estante.descripcion && <div className="muted">{book.estante.descripcion}</div>}
      </dd>
    </dl>

    <div className="form-actions">
      <button className="btn btn-secondary" onClick={onClose}>
        Cerrar
      </button>
    </div>
  </Modal>
);