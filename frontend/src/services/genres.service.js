import { createCrudService } from "./crud.service";

const crud = createCrudService("/genres");

export const getGenres = crud.getAll;
export const getGenreById = crud.getById;
export const createGenre = crud.create;
export const updateGenre = crud.update;
export const deleteGenre = crud.remove;