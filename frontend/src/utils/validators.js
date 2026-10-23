import { ValidationError, number, object, string } from "yup";

const MAX_YEAR = new Date().getFullYear() + 1; // el backend acepta hasta el año siguiente

// Los inputs entregan "" cuando están vacíos: lo tratamos como "sin valor"
const emptyToUndefined = (value, original) => (original === "" || original == null ? undefined : value);
const emptyToNull = (value, original) => (original === "" || original == null ? null : value);

const requiredText = (label, max) =>
  string()
    .trim()
    .required(`${label} es obligatorio`)
    .max(max, `${label} no puede superar los ${max} caracteres`);

const optionalText = (label, max) =>
  string()
    .trim()
    .max(max, `${label} no puede superar los ${max} caracteres`)
    .nullable()
    .transform(emptyToNull);

const requiredSelect = (message) =>
  number().transform(emptyToUndefined).typeError(message).required(message);

const yearField = (required) => {
  let field = number()
    .transform(emptyToUndefined)
    .typeError("El año debe ser un número")
    .integer("El año debe ser un número entero")
    .min(1, "El año debe ser mayor a 0")
    .max(MAX_YEAR, `El año no puede ser mayor a ${MAX_YEAR}`);
  if (required) field = field.required("El año de publicación es obligatorio");
  return field;
};

export const authorSchema = object({
  nombre: requiredText("El nombre", 150),
  nacionalidad: optionalText("La nacionalidad", 100),
});

export const genreSchema = object({
  nombre: requiredText("El nombre", 100),
});

export const sagaSchema = object({
  nombre: requiredText("El nombre", 150),
});

export const shelfSchema = object({
  codigo: requiredText("El código", 100),
  descripcion: optionalText("La descripción", 255),
});

export const bookSchema = object({
  titulo: requiredText("El título", 255),
  anioPublicacion: yearField(true),
  autorId: requiredSelect("Seleccioná un autor"),
  generoId: requiredSelect("Seleccioná un género"),
  estanteId: requiredSelect("Seleccioná un estante"),
  sagaId: number().nullable().transform(emptyToNull).typeError("Seleccioná una saga válida"),
});

// Filtros del listado: todos opcionales
export const bookFilterSchema = object({
  autorId: number().transform(emptyToUndefined).typeError("Autor inválido"),
  generoId: number().transform(emptyToUndefined).typeError("Género inválido"),
  anioPublicacion: yearField(false),
});

/**
 * Valida `values` contra un schema de Yup.
 * Devuelve { data, errors }:
 *  - data: valores ya limpios y convertidos (números, strings sin espacios, null), o null si hay errores
 *  - errors: objeto { campo: "mensaje" } con el primer error de cada campo
 */
export const validateForm = async (schema, values) => {
  try {
    const data = await schema.validate(values, { abortEarly: false });
    return { data, errors: {} };
  } catch (err) {
    if (!(err instanceof ValidationError)) throw err;
    const errors = {};
    const issues = err.inner.length > 0 ? err.inner : [err];
    for (const issue of issues) {
      if (issue.path && !errors[issue.path]) errors[issue.path] = issue.message;
    }
    return { data: null, errors };
  }
};