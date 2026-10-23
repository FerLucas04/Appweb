// type: "error" | "success" | "info"
export const Alert = ({ type = "error", children, onClose }) => (
  <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
    {children}
    {onClose && (
      <button className="modal-close" onClick={onClose} aria-label="Cerrar aviso" style={{ float: "right" }}>
        x
      </button>
    )}
  </div>
);