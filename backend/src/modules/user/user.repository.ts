import { AppDataSource } from "../../database/data-source.js";
import { User } from "./user.entity.js";

// Función (y no constante) para pedir el repositorio recién cuando se usa:
// al importar este archivo, AppDataSource todavía no está inicializado.
const repo = () => AppDataSource.getRepository(User);

export const userRepository = {
  findByEmail: (email: string) => repo().findOneBy({ email }),

  findById: (id: number) => repo().findOneBy({ id }),

  count: () => repo().count(),

  save: (user: User) => repo().save(user),

  create: (data: Pick<User, "email" | "passwordHash" | "nombre">) =>
    repo().save(repo().create(data)),
};