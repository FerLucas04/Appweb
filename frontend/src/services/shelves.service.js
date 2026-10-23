import { ENDPOINTS } from "../constants";
import { api } from "./api";

export const getShelves = async () => {
  const { data } = await api.get(ENDPOINTS.SHELVES);
  return data.data;
};

export const getShelfById = async (id) => {
  const { data } = await api.get(`${ENDPOINTS.SHELVES}/${id}`);
  return data.data;
};

export const createShelf = async (shelf) => {
  const { data } = await api.post(ENDPOINTS.SHELVES, shelf);
  return data.data;
};

export const updateShelf = async (id, shelf) => {
  const { data } = await api.put(`${ENDPOINTS.SHELVES}/${id}`, shelf);
  return data.data;
};

export const deleteShelf = async (id) => {
  await api.delete(`${ENDPOINTS.SHELVES}/${id}`);
};