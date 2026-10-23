import { AppDataSource } from "../../database/data-source.js";
import { Author } from "./author.entity.js";

const repo = () => AppDataSource.getRepository(Author);

export const authorRepository = {
  findAll: () => repo().find({ order: { nombre: "ASC" } }),
  findById: (id: number) => repo().findOneBy({ id }),
  create: (data: Pick<Author, "nombre" | "nacionalidad">) => repo().save(repo().create(data)),
  update: (id: number, data: Pick<Author, "nombre" | "nacionalidad">) => repo().update({ id }, data),
  delete: (id: number) => repo().delete({ id }),
};