import { createCrudService } from "./crud.service";

const crud = createCrudService("/sagas");

export const getSagas = crud.getAll;
export const getSagaById = crud.getById;
export const createSaga = crud.create;
export const updateSaga = crud.update;
export const deleteSaga = crud.remove;