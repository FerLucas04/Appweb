import type { Request } from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getBody, parseId, requiredString } from "../../utils/validators.js";
import { genreService, type GenreInput } from "./genre.service.js";

const parseInput = (req: Request): GenreInput => ({
  nombre: requiredString(getBody(req).nombre, "nombre", 100),
});

export const getGenres = asyncHandler(async (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ success: true, data: await genreService.getAll() });
});

export const getGenreById = asyncHandler(async (req, res) => {
  const data = await genreService.getById(parseId(req.params.id));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const createGenre = asyncHandler(async (req, res) => {
  const data = await genreService.create(parseInput(req));
  res.status(HTTP_STATUS.CREATED).json({ success: true, data });
});

export const updateGenre = asyncHandler(async (req, res) => {
  const data = await genreService.update(parseId(req.params.id), parseInput(req));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const deleteGenre = asyncHandler(async (req, res) => {
  await genreService.remove(parseId(req.params.id));
  res.status(HTTP_STATUS.NO_CONTENT).send();
});