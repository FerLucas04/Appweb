import "dotenv/config"; //carga del .env
import "reflect-metadata"; //decoradores
import { DataSource } from "typeorm";
import { User } from "../modules/user/user.entity.js";
import { Book } from "../modules/book/book.entity.js";
import { Author } from "../modules/author/author.entity.js";
import { Shelf } from "../modules/shelf/shelf.entity.js";
import { Genre } from "../modules/genre/genre.entity.js";
import { Saga } from "../modules/saga/saga.entity.js";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Book, Author, Shelf, Genre, Saga],
});