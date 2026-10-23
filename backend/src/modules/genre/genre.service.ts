import { AppError } from "../../middlewares/errors.js";
import { genreRepository } from "./genre.repository.js";

export interface GenreInput {
  nombre: string;
}

const getAll = () => genreRepository.findAll();

const getById = async (id: number) => {
  const genre = await genreRepository.findById(id);
  if (!genre) throw AppError.notFound("Género no encontrado");
  return genre;
};

/** El nombre es único. MySQL compara sin distinguir mayúsculas, así que "Terror" y "terror" chocan. */
const assertNombreLibre = async (nombre: string, ignoreId?: number) => {
  const existing = await genreRepository.findByNombre(nombre);
  if (existing && existing.id !== ignoreId) {
    throw AppError.conflict(`Ya existe un género llamado "${existing.nombre}"`);
  }
};

const create = async (data: GenreInput) => {
  await assertNombreLibre(data.nombre);
  return genreRepository.create(data);
};

const update = async (id: number, data: GenreInput) => {
  await getById(id);
  await assertNombreLibre(data.nombre, id);
  await genreRepository.update(id, data);
  return getById(id);
};

const remove = async (id: number) => {
  await getById(id);
  await genreRepository.delete(id);
};

export const genreService = { getAll, getById, create, update, remove };