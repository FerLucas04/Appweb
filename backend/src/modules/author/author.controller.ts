import type { Request } from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getBody, optionalString, parseId, requiredString } from "../../utils/validators.js";
import { authorService, type AuthorInput } from "./author.service.js";

const parseInput = (req: Request): AuthorInput => {
  const body = getBody(req);
  return {
    nombre: requiredString(body.nombre, "nombre", 150),
    nacionalidad: optionalString(body.nacionalidad, "nacionalidad", 100),
  };
};

export const getAuthors = asyncHandler(async (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ success: true, data: await authorService.getAll() });
});

export const getAuthorById = asyncHandler(async (req, res) => {
  const data = await authorService.getById(parseId(req.params.id));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const createAuthor = asyncHandler(async (req, res) => {
  const data = await authorService.create(parseInput(req));
  res.status(HTTP_STATUS.CREATED).json({ success: true, data });
});

export const updateAuthor = asyncHandler(async (req, res) => {
  const data = await authorService.update(parseId(req.params.id), parseInput(req));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const deleteAuthor = asyncHandler(async (req, res) => {
  await authorService.remove(parseId(req.params.id));
  res.status(HTTP_STATUS.NO_CONTENT).send();
});