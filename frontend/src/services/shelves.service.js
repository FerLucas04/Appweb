import { createCrudService } from "./crud.service";

const crud = createCrudService("/shelves");

export const getShelves = crud.getAll;
export const getShelfById = crud.getById;
export const createShelf = crud.create;
export const updateShelf = crud.update;
export const deleteShelf = crud.remove;