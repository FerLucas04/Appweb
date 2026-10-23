import { AppDataSource } from "../../database/data-source.js";
import { Saga } from "./saga.entity.js";

const repo = () => AppDataSource.getRepository(Saga);

export const sagaRepository = {
  findAll: () => repo().find({ order: { nombre: "ASC" } }),
  findById: (id: number) => repo().findOneBy({ id }),
  create: (data: Pick<Saga, "nombre">) => repo().save(repo().create(data)),
  update: (id: number, data: Pick<Saga, "nombre">) => repo().update({ id }, data),
  delete: (id: number) => repo().delete({ id }),
};