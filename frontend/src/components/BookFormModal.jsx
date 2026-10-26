import { useMemo } from "react";
import { createBook, updateBook } from "../services/books.service";
import { bookSchema } from "../utils/validators";
import { EntityForm } from "./EntityForm";
import { Modal } from "./Modal";

const toOptions = (list, labelKey) => list.map((item) => ({ value: item.id, label: item[labelKey] }));

// El formulario usa authorId/genreId/shelfId; el backend espera autorId/generoId/estanteId
const toPayload = (data) => ({
  titulo: data.titulo,
  anioPublicacion: Number(data.anioPublicacion),
  autorId: Number(data.authorId),
  generoId: Number(data.genreId),
  estanteId: Number(data.shelfId),
  sagaId: data.sagaId === null || data.sagaId === undefined ? null : Number(data.sagaId),
});

// Inverso: libro del backend -> valores iniciales del formulario
const toFormValues = (book) => ({
  titulo: book.titulo,
  anioPublicacion: book.anioPublicacion,
  authorId: book.autorId,
  genreId: book.generoId,
  shelfId: book.estanteId,
  sagaId: book.sagaId,
});

/**
 * Modal de alta y edición de libros.
 *
 * book:    null para un alta, o el libro a editar
 * authors, genres, shelves, sagas: catálogos para los desplegables
 * onSaved: se llama tras guardar con éxito (el padre cierra el modal y recarga la lista)
 * onClose: cierra sin guardar
 */
export const BookFormModal = ({ book, authors, genres, shelves, sagas, onSaved, onClose }) => {
  const isEdit = Boolean(book);

  const fields = useMemo(
    () => [
      { name: "titulo", label: "Título", type: "text" },
      { name: "anioPublicacion", label: "Año de publicación", type: "number" },
      { name: "authorId", label: "Autor", type: "select", emptyLabel: "Seleccioná un autor", options: toOptions(authors, "nombre") },
      { name: "genreId", label: "Género", type: "select", emptyLabel: "Seleccioná un género", options: toOptions(genres, "nombre") },
      { name: "shelfId", label: "Estante", type: "select", emptyLabel: "Seleccioná un estante", options: toOptions(shelves, "codigo") },
      { name: "sagaId", label: "Saga (opcional)", type: "select", emptyLabel: "Sin saga", options: toOptions(sagas, "nombre") },
    ],
    [authors, genres, shelves, sagas],
  );

  // Recibe los datos ya validados y convertidos por Yup.
  // Si createBook/updateBook lanzan un error, EntityForm lo muestra dentro del modal.
  const handleSubmit = async (data) => {
    const payload = toPayload(data);

    if (isEdit) await updateBook(book.id, payload);
    else await createBook(payload);

    onSaved(isEdit ? "Libro actualizado correctamente" : "Libro creado correctamente");
  };

  return (
    <Modal title={isEdit ? "Editar libro" : "Nuevo libro"} onClose={onClose}>
      <EntityForm
        fields={fields}
        schema={bookSchema}
        initialValues={book ? toFormValues(book) : {}}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={isEdit ? "Guardar cambios" : "Crear libro"}
      />
    </Modal>
  );
};