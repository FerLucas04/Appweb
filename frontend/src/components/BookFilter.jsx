import { useState } from "react";
import { bookFilterSchema, validateForm } from "../utils/validators";
import { FormField } from "./FormField";

const EMPTY = { autorId: "", generoId: "", anioPublicacion: "" };

/**
 * Panel de filtros combinables.
 * authors / genres: listas [{ id, nombre }] para los desplegables
 * onApply: recibe { autorId, generoId, anioPublicacion } (números o undefined)
 */
export const BookFilter = ({ authors, genres, onApply }) => {
  const [draft, setDraft] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setDraft((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, errors: validationErrors } = await validateForm(bookFilterSchema, draft);
    setErrors(validationErrors);
    if (data) onApply(data);
  };

  const handleClear = () => {
    setDraft(EMPTY);
    setErrors({});
    onApply({});
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit} noValidate>
      <FormField id="filter-autorId" label="Autor" error={errors.autorId}>
        <select id="filter-autorId" name="autorId" value={draft.autorId} onChange={handleChange}>
          <option value="">Todos</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="filter-generoId" label="Género" error={errors.generoId}>
        <select id="filter-generoId" name="generoId" value={draft.generoId} onChange={handleChange}>
          <option value="">Todos</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="filter-anio" label="Año de publicación" error={errors.anioPublicacion}>
        <input
          id="filter-anio"
          name="anioPublicacion"
          type="number"
          placeholder="Ej.: 1967"
          value={draft.anioPublicacion}
          onChange={handleChange}
          aria-invalid={Boolean(errors.anioPublicacion)}
        />
      </FormField>

      <button type="submit" className="btn">
        Filtrar
      </button>
      <button type="button" className="btn btn-secondary" onClick={handleClear}>
        Limpiar
      </button>
    </form>
  );
};