import { ENDPOINTS } from "../constants";
import { api } from "./api";

export const getSagas = async () => {
  const { data } = await api.get(ENDPOINTS.SAGAS);
  return data.data;
};

export const getSagaById = async (id) => {
  const { data } = await api.get(`${ENDPOINTS.SAGAS}/${id}`);
  return data.data;
};

export const createSaga = async (saga) => {
  const { data } = await api.post(ENDPOINTS.SAGAS, saga);
  return data.data;
};

export const updateSaga = async (id, saga) => {
  const { data } = await api.put(`${ENDPOINTS.SAGAS}/${id}`, saga);
  return data.data;
};

export const deleteSaga = async (id) => {
  await api.delete(`${ENDPOINTS.SAGAS}/${id}`);
};