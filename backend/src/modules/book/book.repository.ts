import type { FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../../database/data-source.js";
import { Book } from "./book.entity.js";

export interface BookFilters {
  autorId?: number;
  generoId?: number;
  anioPublicacion?: number;
}

export type BookData = Pick<Book, "titulo" | "anioPublicacion" | "autorId" | "generoId" | "estanteId" | "sagaId">;

const repo = () => AppDataSource.getRepository(Book);

const RELATIONS = { autor: true, genero: true, estante: true, saga: true } as const;

export const bookRepository = {
  /** Solo se aplican los filtros presentes; combinados se unen con AND. */
  findAll: (filters: BookFilters) => {
    const where: FindOptionsWhere<Book> = {};
    if (filters.autorId !== undefined) where.autorId = filters.autorId;
    if (filters.generoId !== undefined) where.generoId = filters.generoId;
    if (filters.anioPublicacion !== undefined) where.anioPublicacion = filters.anioPublicacion;

    return repo().find({ where, relations: RELATIONS, order: { titulo: "ASC" } });
  },

  findById: (id: number) => repo().findOne({ where: { id }, relations: RELATIONS }),

  create: (data: BookData) => repo().save(repo().create(data)),

  update: (id: number, data: BookData) => repo().update({ id }, data),

  delete: (id: number) => repo().delete({ id }),
};