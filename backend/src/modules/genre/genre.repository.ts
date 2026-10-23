import { AppDataSource } from "../../database/data-source.js";
import { Genre } from "./genre.entity.js";

const repo = () => AppDataSource.getRepository(Genre);

export const genreRepository = {
  findAll: () => repo().find({ order: { nombre: "ASC" } }),
  findById: (id: number) => repo().findOneBy({ id }),
  findByNombre: (nombre: string) => repo().findOneBy({ nombre }),
  create: (data: Pick<Genre, "nombre">) => repo().save(repo().create(data)),
  update: (id: number, data: Pick<Genre, "nombre">) => repo().update({ id }, data),
  delete: (id: number) => repo().delete({ id }),
};