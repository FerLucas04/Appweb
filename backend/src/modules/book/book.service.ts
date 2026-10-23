import { AppError } from "../../middlewares/errors.js";
import { authorRepository } from "../author/author.repository.js";
import { genreRepository } from "../genre/genre.repository.js";
import { sagaRepository } from "../saga/saga.repository.js";
import { shelfRepository } from "../shelf/shelf.repository.js";
import { bookRepository, type BookData, type BookFilters } from "./book.repository.js";

export type { BookFilters };
export type BookInput = BookData;

/** Verifica que autor, género, estante y (si viene) saga existan. */
const assertReferencias = async (data: BookInput): Promise<void> => {
  const [autor, genero, estante, saga] = await Promise.all([
    authorRepository.findById(data.autorId),
    genreRepository.findById(data.generoId),
    shelfRepository.findById(data.estanteId),
    data.sagaId === null ? Promise.resolve(true) : sagaRepository.findById(data.sagaId),
  ]);

  if (!autor) throw AppError.validation(`El autor con id ${data.autorId} no existe`, { field: "autorId" });
  if (!genero) throw AppError.validation(`El género con id ${data.generoId} no existe`, { field: "generoId" });
  if (!estante) throw AppError.validation(`El estante con id ${data.estanteId} no existe`, { field: "estanteId" });
  if (!saga) throw AppError.validation(`La saga con id ${data.sagaId} no existe`, { field: "sagaId" });
};

const getBooks = (filters: BookFilters) => bookRepository.findAll(filters);

const getBookById = async (id: number) => {
  const book = await bookRepository.findById(id);
  if (!book) throw AppError.notFound("Libro no encontrado");
  return book;
};

const createLibro = async (data: BookInput) => {
  await assertReferencias(data);
  const created = await bookRepository.create(data);
  return getBookById(created.id); // devolvemos el libro con las relaciones pobladas
};

const updateLibro = async (id: number, data: BookInput) => {
  await getBookById(id);
  await assertReferencias(data);
  await bookRepository.update(id, data);
  return getBookById(id);
};

const deleteLibro = async (id: number) => {
  await getBookById(id);
  await bookRepository.delete(id);
};

export const bookService = { getBooks, getBookById, createLibro, updateLibro, deleteLibro };