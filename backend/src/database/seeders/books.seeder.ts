import { IS_PRODUCTION } from "../../constants/index.js";
import { authorRepository } from "../../modules/author/author.repository.js";
import { bookRepository } from "../../modules/book/book.repository.js";
import { genreRepository } from "../../modules/genre/genre.repository.js";
import { sagaRepository } from "../../modules/saga/saga.repository.js";
import { shelfRepository } from "../../modules/shelf/shelf.repository.js";
import { logger } from "../../utils/logger.js";

const getOrCreateGenre = async (nombre: string) =>
  (await genreRepository.findByNombre(nombre)) ?? genreRepository.create({ nombre });

const getOrCreateShelf = async (codigo: string, descripcion: string) =>
  (await shelfRepository.findByCodigo(codigo)) ?? shelfRepository.create({ codigo, descripcion });

/**
 * Carga datos de prueba (autores, géneros, estantes, una saga y libros).
 * Solo corre en desarrollo y únicamente si no hay libros ni autores,
 * así que es seguro dejarlo en cada arranque.
 */
export const seedSampleBooks = async (): Promise<void> => {
  if (IS_PRODUCTION) return;

  const [totalBooks, totalAuthors] = await Promise.all([bookRepository.count(), authorRepository.count()]);
  if (totalBooks > 0 || totalAuthors > 0) {
    logger.info("Seeder: ya hay libros o autores cargados, no se agregan datos de prueba");
    return;
  }

  // Autores
  const garciaMarquez = await authorRepository.create({ nombre: "Gabriel García Márquez", nacionalidad: "Colombiana" });
  const borges = await authorRepository.create({ nombre: "Jorge Luis Borges", nacionalidad: "Argentina" });
  const rowling = await authorRepository.create({ nombre: "J. K. Rowling", nacionalidad: "Británica" });

  // Géneros y estantes
  const realismoMagico = await getOrCreateGenre("Realismo mágico");
  const cuento = await getOrCreateGenre("Cuento");
  const fantasia = await getOrCreateGenre("Fantasía");

  const estanteA1 = await getOrCreateShelf("Estante A-1", "Narrativa latinoamericana");
  const estanteA2 = await getOrCreateShelf("Estante A-2", "Cuentos y relatos");
  const estanteB1 = await getOrCreateShelf("Estante B-1", "Fantasía y aventuras");

  // Saga
  const harryPotter = await sagaRepository.create({ nombre: "Harry Potter" });

  // Libros
  const books = [
    { titulo: "Cien años de soledad", anioPublicacion: 1967, autorId: garciaMarquez.id, generoId: realismoMagico.id, estanteId: estanteA1.id, sagaId: null },
    { titulo: "El amor en los tiempos del cólera", anioPublicacion: 1985, autorId: garciaMarquez.id, generoId: realismoMagico.id, estanteId: estanteA1.id, sagaId: null },
    { titulo: "Ficciones", anioPublicacion: 1944, autorId: borges.id, generoId: cuento.id, estanteId: estanteA2.id, sagaId: null },
    { titulo: "Harry Potter y la piedra filosofal", anioPublicacion: 1997, autorId: rowling.id, generoId: fantasia.id, estanteId: estanteB1.id, sagaId: harryPotter.id },
    { titulo: "Harry Potter y la cámara secreta", anioPublicacion: 1998, autorId: rowling.id, generoId: fantasia.id, estanteId: estanteB1.id, sagaId: harryPotter.id },
  ];

  for (const book of books) {
    await bookRepository.create(book);
  }

  logger.info(`Seeder: datos de prueba creados (${books.length} libros, 3 autores, 3 géneros, 3 estantes, 1 saga)`);
};