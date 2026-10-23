import { useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";
import { Alert } from "./Alert";
import { ConfirmModal } from "./ConfirmModal";
import { EntityForm } from "./EntityForm";
import { Loading } from "./Loading";
import { Modal } from "./Modal";
import { Table } from "./Table";

/**
 * CRUD completo de un catálogo, dirigido por configuración (ver ManagementPage):
 * { singular, newLabel, editLabel, emptyMessage, describe, service, schema, fields, columns }
 */
export const CatalogTab = ({ config }) => {
  const { singular, newLabel, editLabel, emptyMessage, describe, service, schema, fields, columns } = config;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // undefined = modal cerrado, null = alta, objeto = edición
  const [formItem, setFormItem] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;
    service
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
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
  }, [service, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const handleSave = async (data) => {
    if (formItem) {
      await service.update(formItem.id, data);
      setNotice(`${singular[0].toUpperCase()}${singular.slice(1)} actualizado correctamente`);
    } else {
      await service.create(data);
      setNotice(`${singular[0].toUpperCase()}${singular.slice(1)} creado correctamente`);
    }
    setFormItem(undefined);
    reload();
  };

  const handleDelete = async () => {
    await service.remove(deleteTarget.id); // si falla (ej. 409), ConfirmModal muestra el error
    setDeleteTarget(null);
    setNotice(`${singular[0].toUpperCase()}${singular.slice(1)} eliminado correctamente`);
    reload();
  };

  return (
    <>
      <div className="page-header">
        <span className="muted">{items.length} registro(s)</span>
        <button className="btn" onClick={() => setFormItem(null)} style={{ marginTop: 0 }}>
          + {newLabel}
        </button>
      </div>

      {notice && (
        <Alert type="success" onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      )}
      {error && <Alert type="error">{error}</Alert>}
      {loading && <Loading />}

      {!loading && !error && (
        <Table
          columns={columns}
          data={items}
          emptyMessage={emptyMessage}
          renderActions={(row) => (
            <div className="row-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setFormItem(row)}>
                Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(row)}>
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {formItem !== undefined && (
        <Modal title={formItem ? editLabel : newLabel} onClose={() => setFormItem(undefined)}>
          <EntityForm
            fields={fields}
            schema={schema}
            initialValues={formItem ?? {}}
            onSubmit={handleSave}
            onCancel={() => setFormItem(undefined)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title={`Eliminar ${singular}`}
          message={`¿Eliminar ${singular} "${describe(deleteTarget)}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};