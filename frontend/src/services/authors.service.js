import { createCrudService } from "./crud.service";

const crud = createCrudService("/authors");

export const getAuthors = crud.getAll;
export const getAuthorById = crud.getById;
export const createAuthor = crud.create;
export const updateAuthor = crud.update;
export const deleteAuthor = crud.remove;