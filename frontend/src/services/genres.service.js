import { ENDPOINTS } from "../constants";
import { api } from "./api";

export const getGenres = async () => {
  const { data } = await api.get(ENDPOINTS.GENRES);
  return data.data;
};

export const getGenreById = async (id) => {
  const { data } = await api.get(`${ENDPOINTS.GENRES}/${id}`);
  return data.data;
};

export const createGenre = async (genre) => {
  const { data } = await api.post(ENDPOINTS.GENRES, genre);
  return data.data;
};

export const updateGenre = async (id, genre) => {
  const { data } = await api.put(`${ENDPOINTS.GENRES}/${id}`, genre);
  return data.data;
};

export const deleteGenre = async (id) => {
  await api.delete(`${ENDPOINTS.GENRES}/${id}`);
};