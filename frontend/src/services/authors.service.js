import { ENDPOINTS } from "../constants";
import { api } from "./api";

export const getAuthors = async () => {
  const { data } = await api.get(ENDPOINTS.AUTHORS);
  return data.data;
};

export const getAuthorById = async (id) => {
  const { data } = await api.get(`${ENDPOINTS.AUTHORS}/${id}`);
  return data.data;
};

export const createAuthor = async (author) => {
  const { data } = await api.post(ENDPOINTS.AUTHORS, author);
  return data.data;
};

export const updateAuthor = async (id, author) => {
  const { data } = await api.put(`${ENDPOINTS.AUTHORS}/${id}`, author);
  return data.data;
};

export const deleteAuthor = async (id) => {
  await api.delete(`${ENDPOINTS.AUTHORS}/${id}`);
};