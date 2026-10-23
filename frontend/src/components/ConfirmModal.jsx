import { useState } from "react";
import { getErrorMessage } from "../services/api";
import { Alert } from "./Alert";
import { Modal } from "./Modal";

/*
 * Confirmación de borrado.
 * onConfirm: función async; si lanza un error (ej. 409 "registro en uso"), se muestra acá mismo.
 */
export const ConfirmModal = ({ title, message, confirmLabel = "Eliminar", onConfirm, onCancel }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(getErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Modal title={title} onClose={onCancel}>
      {error && <Alert type="error">{error}</Alert>}
      <p>{message}</p>
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel} disabled={busy}>
          Cancelar
        </button>
        <button className="btn btn-danger" onClick={handleConfirm} disabled={busy}>
          {busy ? "Eliminando…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};