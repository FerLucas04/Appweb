import { useCallback, useEffect, useState } from "react";
import { ENDPOINTS } from "../constants";
import { api, getErrorMessage } from "../services/api";

//Ventan de eventos - Muestra los logs del backend en una tabla
//según el nivel que tengan (info-warn-error)

// Cada log del backend tiene la forma:
// { id, timestamp, level: "info" | "warn" | "error", message, meta? }
const LEVEL_FILTERS = ["all", "info", "warn", "error"];
const LIMIT_OPTIONS = [50, 100, 200, 500];
const REFRESH_MS = 5000;

export const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [level, setLevel] = useState("all");
  const [limit, setLimit] = useState(100);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLogs = useCallback(async () => {
    try {
      const { data } = await api.get(ENDPOINTS.LOGS, {
        params: { level: level === "all" ? undefined : level, limit },
      });
      setLogs(data.data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [level, limit]);

  // Carga inicial y cada vez que cambia un filtro
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Actualización automática opcional
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(loadLogs, REFRESH_MS);
    return () => clearInterval(id);
  }, [autoRefresh, loadLogs]);

  return (
    <div className="card">
      <div className="toolbar">
        <h1>Eventos del sistema</h1>
        <div className="toolbar-actions">
          <label className="inline">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            Auto-actualizar
          </label>
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} aria-label="Cantidad de eventos">
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                Últimos {n}
              </option>
            ))}
          </select>
          <button className="btn btn-secondary" onClick={loadLogs}>
            Actualizar
          </button>
        </div>
      </div>

      <div className="filters" role="group" aria-label="Filtrar por nivel">
        {LEVEL_FILTERS.map((f) => (
          <button key={f} className={`chip ${level === f ? "chip-active" : ""}`} onClick={() => setLevel(f)}>
            {f === "all" ? "Todos" : f.toUpperCase()}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p className="muted">Cargando…</p>}
      {!loading && !error && logs.length === 0 && <p className="muted">No hay eventos para mostrar.</p>}

      {logs.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Nivel</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="nowrap">{new Date(log.timestamp).toLocaleString("es-AR")}</td>
                  <td>
                    <span className={`badge badge-${log.level}`}>{log.level.toUpperCase()}</span>
                  </td>
                  <td>
                    {log.message}
                    {log.meta && (
                      <details>
                        <summary>Detalle</summary>
                        <pre>{log.meta}</pre>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};