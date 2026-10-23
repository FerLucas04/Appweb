import { AppError } from "../../middlewares/errors.js";
import { shelfRepository } from "./shelf.repository.js";

export interface ShelfInput {
  codigo: string;
  descripcion: string | null;
}

const getAll = () => shelfRepository.findAll();

const getById = async (id: number) => {
  const shelf = await shelfRepository.findById(id);
  if (!shelf) throw AppError.notFound("Estante no encontrado");
  return shelf;
};

const assertCodigoLibre = async (codigo: string, ignoreId?: number) => {
  const existing = await shelfRepository.findByCodigo(codigo);
  if (existing && existing.id !== ignoreId) {
    throw AppError.conflict(`Ya existe un estante con el código "${existing.codigo}"`);
  }
};

const create = async (data: ShelfInput) => {
  await assertCodigoLibre(data.codigo);
  return shelfRepository.create(data);
};

const update = async (id: number, data: ShelfInput) => {
  await getById(id);
  await assertCodigoLibre(data.codigo, id);
  await shelfRepository.update(id, data);
  return getById(id);
};

const remove = async (id: number) => {
  await getById(id);
  await shelfRepository.delete(id);
};

export const shelfService = { getAll, getById, create, update, remove };