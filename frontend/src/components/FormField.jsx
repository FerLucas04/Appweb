// Envuelve un input/select con su etiqueta y su mensaje de error
export const FormField = ({ id, label, error, children }) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    {children}
    {error && <span className="field-error">{error}</span>}
  </div>
);