import { ENDPOINTS } from "../constants";
import { api } from "./api";

/** options: { level?: "info" | "warn" | "error", limit?: number } */
export const getLogs = async ({ level, limit } = {}) => {
  const { data } = await api.get(ENDPOINTS.LOGS, { params: { level: level || undefined, limit } });
  return data.data;
};