import { AppError } from "../../middlewares/errors.js";
import { sagaRepository } from "./saga.repository.js";

export interface SagaInput {
  nombre: string;
}

const getAll = () => sagaRepository.findAll();

const getById = async (id: number) => {
  const saga = await sagaRepository.findById(id);
  if (!saga) throw AppError.notFound("Saga no encontrada");
  return saga;
};

const create = (data: SagaInput) => sagaRepository.create(data);

const update = async (id: number, data: SagaInput) => {
  await getById(id);
  await sagaRepository.update(id, data);
  return getById(id);
};

const remove = async (id: number) => {
  await getById(id);
  await sagaRepository.delete(id);
};

export const sagaService = { getAll, getById, create, update, remove };