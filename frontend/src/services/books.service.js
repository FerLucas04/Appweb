import { api } from "./api";

const BASE = "/books";

// Solo se envían los filtros que tienen valor
const cleanParams = (filters = {}) =>
  Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== ""));

/** filters: { autorId, generoId, anioPublicacion } (todos opcionales y combinables) */
export const getBooks = async (filters) => {
  const { data } = await api.get(BASE, { params: cleanParams(filters) });
  return data.data;
};

export const getBookById = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`);
  return data.data;
};

export const createBook = async (book) => {
  const { data } = await api.post(BASE, book);
  return data.data;
};

export const updateBook = async (id, book) => {
  const { data } = await api.put(`${BASE}/${id}`, book);
  return data.data;
};

export const deleteBook = async (id) => {
  await api.delete(`${BASE}/${id}`);
};