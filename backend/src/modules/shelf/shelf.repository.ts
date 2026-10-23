import { AppDataSource } from "../../database/data-source.js";
import { Shelf } from "./shelf.entity.js";

const repo = () => AppDataSource.getRepository(Shelf);

export const shelfRepository = {
  findAll: () => repo().find({ order: { codigo: "ASC" } }),
  findById: (id: number) => repo().findOneBy({ id }),
  findByCodigo: (codigo: string) => repo().findOneBy({ codigo }),
  create: (data: Pick<Shelf, "codigo" | "descripcion">) => repo().save(repo().create(data)),
  update: (id: number, data: Pick<Shelf, "codigo" | "descripcion">) => repo().update({ id }, data),
  delete: (id: number) => repo().delete({ id }),
};