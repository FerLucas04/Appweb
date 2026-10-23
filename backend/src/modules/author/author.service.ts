import { AppError } from "../../middlewares/errors.js";
import { authorRepository } from "./author.repository.js";

export interface AuthorInput {
  nombre: string;
  nacionalidad: string | null;
}

const getAll = () => authorRepository.findAll();

const getById = async (id: number) => {
  const author = await authorRepository.findById(id);
  if (!author) throw AppError.notFound("Autor no encontrado");
  return author;
};

const create = (data: AuthorInput) => authorRepository.create(data);

const update = async (id: number, data: AuthorInput) => {
  await getById(id);
  await authorRepository.update(id, data);
  return getById(id);
};

const remove = async (id: number) => {
  await getById(id);
  await authorRepository.delete(id);
};

export const authorService = { getAll, getById, create, update, remove };