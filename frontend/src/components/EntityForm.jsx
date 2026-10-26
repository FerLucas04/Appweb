import { useState } from "react";
import { getErrorMessage } from "../services/api";
import { validateForm } from "../utils/validators";
import { Alert } from "./Alert";
import { FormField } from "./FormField";

/**
 * Formulario genérico dirigido por configuración, usado para libros y los cuatro catálogos.
 *
 * fields: [{ name, label, type: "text" | "number" | "select", options?, emptyLabel? }]
 * schema: schema de Yup (sus claves deben coincidir con los `name` de los campos)
 * initialValues: valores iniciales (vacío para un alta)
 * onSubmit: función async que recibe los datos ya validados y limpios
 */
export const EntityForm = ({ fields, schema, initialValues = {}, onSubmit, onCancel, submitLabel = "Guardar" }) => {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, String(initialValues[f.name] ?? "")])),
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fieldNames = fields.map((f) => f.name);
  // Errores de validación que no pertenecen a ningún campo visible (ej. schema desincronizado)
  const orphanErrors = Object.entries(errors)
    .filter(([name]) => !fieldNames.includes(name))
    .map(([name, message]) => `${name}: ${message}`);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const { data, errors: validationErrors } = await validateForm(schema, values);
    setErrors(validationErrors);

    if (!data) {
      console.error("[EntityForm] Validación fallida:", validationErrors, "valores:", values);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(data); // si sale bien, el padre cierra el modal
    } catch (err) {
      console.error("[EntityForm] Error al guardar:", err);
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {serverError && <Alert type="error">{serverError}</Alert>}
      {orphanErrors.length > 0 && (
        <Alert type="error">
          No se pudo validar el formulario ({orphanErrors.join("; ")}). Revisá que el schema de Yup use los mismos
          nombres de campo que el formulario.
        </Alert>
      )}

      {fields.map((field) => {
        const id = `field-${field.name}`;
        const common = {
          id,
          name: field.name,
          value: values[field.name],
          onChange: handleChange,
          "aria-invalid": Boolean(errors[field.name]),
        };

        return (
          <FormField key={field.name} id={id} label={field.label} error={errors[field.name]}>
            {field.type === "select" ? (
              <select {...common}>
                <option value="">{field.emptyLabel ?? "Seleccioná una opción"}</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input type={field.type ?? "text"} {...common} />
            )}
          </FormField>
        );
      })}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </button>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
};