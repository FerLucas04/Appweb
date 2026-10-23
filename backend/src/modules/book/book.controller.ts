import type { Request } from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getBody,
  optionalId,
  optionalQueryInt,
  parseId,
  requiredId,
  requiredInt,
  requiredString,
} from "../../utils/validators.js";
import { bookService, type BookFilters, type BookInput } from "./book.service.js";

const parseFilters = (req: Request): BookFilters => {
  const filters: BookFilters = {};
  const autorId = optionalQueryInt(req.query.autorId, "autorId");
  const generoId = optionalQueryInt(req.query.generoId, "generoId");
  const anio = optionalQueryInt(req.query.anioPublicacion, "anioPublicacion", 1);

  if (autorId !== undefined) filters.autorId = autorId;
  if (generoId !== undefined) filters.generoId = generoId;
  if (anio !== undefined) filters.anioPublicacion = anio;
  return filters;
};

const parseInput = (req: Request): BookInput => {
  const body = getBody(req);
  return {
    titulo: requiredString(body.titulo, "titulo", 255),
    anioPublicacion: requiredInt(body.anioPublicacion, "anioPublicacion", 1, new Date().getFullYear() + 1),
    autorId: requiredId(body.autorId, "autorId"),
    generoId: requiredId(body.generoId, "generoId"),
    estanteId: requiredId(body.estanteId, "estanteId"),
    sagaId: optionalId(body.sagaId, "sagaId"),
  };
};

export const getBooks = asyncHandler(async (req, res) => {
  const data = await bookService.getBooks(parseFilters(req));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const getBookById = asyncHandler(async (req, res) => {
  const data = await bookService.getBookById(parseId(req.params.id));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const createBook = asyncHandler(async (req, res) => {
  const data = await bookService.createLibro(parseInput(req));
  res.status(HTTP_STATUS.CREATED).json({ success: true, data });
});

export const updateBook = asyncHandler(async (req, res) => {
  const data = await bookService.updateLibro(parseId(req.params.id), parseInput(req));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const deleteBook = asyncHandler(async (req, res) => {
  await bookService.deleteLibro(parseId(req.params.id));
  res.status(HTTP_STATUS.NO_CONTENT).send();
});