import { api } from "./api";

/**
 * Genera las cinco operaciones CRUD de un recurso REST.
 * basePath: ruta del recurso, siempre con "/" inicial (ej. "/authors").
 */
export const createCrudService = (basePath) => {
  if (typeof basePath !== "string" || !basePath.startsWith("/")) {
    throw new Error(`createCrudService: ruta inválida (${String(basePath)})`);
  }

  return {
    getAll: async () => {
      const { data } = await api.get(basePath);
      return data.data;
    },
    getById: async (id) => {
      const { data } = await api.get(`${basePath}/${id}`);
      return data.data;
    },
    create: async (payload) => {
      const { data } = await api.post(basePath, payload);
      return data.data;
    },
    update: async (id, payload) => {
      const { data } = await api.put(`${basePath}/${id}`, payload);
      return data.data;
    },
    remove: async (id) => {
      await api.delete(`${basePath}/${id}`);
    },
  };
};