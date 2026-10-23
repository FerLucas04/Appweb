import { useState } from "react";
import { getErrorMessage } from "../services/api";
import { validateForm } from "../utils/validators";
import { Alert } from "./Alert";
import { FormField } from "./FormField";

/*
 * Formulario genérico dirigido por configuración, usado para libros y los cuatro catálogos.
 *
 * fields: [{ name, label, type: "text" | "number" | "select", options?, emptyLabel? }]
 *   options (solo select): [{ value, label }]
 * schema: schema de Yup
 * initialValues: objeto con los valores iniciales (vacío para un alta)
 * onSubmit: función async que recibe los datos ya validados y limpios
 */
export const EntityForm = ({ fields, schema, initialValues = {}, onSubmit, onCancel, submitLabel = "Guardar" }) => {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, String(initialValues[f.name] ?? "")])),
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const { data, errors: validationErrors } = await validateForm(schema, values);
    setErrors(validationErrors);
    if (!data) return;

    setSubmitting(true);
    try {
      await onSubmit(data); // si sale bien, el padre cierra el modal
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {serverError && <Alert type="error">{serverError}</Alert>}

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