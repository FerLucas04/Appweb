import type { Request } from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getBody, optionalString, parseId, requiredString } from "../../utils/validators.js";
import { shelfService, type ShelfInput } from "./shelf.service.js";

const parseInput = (req: Request): ShelfInput => {
  const body = getBody(req);
  return {
    codigo: requiredString(body.codigo, "codigo", 100),
    descripcion: optionalString(body.descripcion, "descripcion", 255),
  };
};

export const getShelves = asyncHandler(async (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ success: true, data: await shelfService.getAll() });
});

export const getShelfById = asyncHandler(async (req, res) => {
  const data = await shelfService.getById(parseId(req.params.id));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const createShelf = asyncHandler(async (req, res) => {
  const data = await shelfService.create(parseInput(req));
  res.status(HTTP_STATUS.CREATED).json({ success: true, data });
});

export const updateShelf = asyncHandler(async (req, res) => {
  const data = await shelfService.update(parseId(req.params.id), parseInput(req));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const deleteShelf = asyncHandler(async (req, res) => {
  await shelfService.remove(parseId(req.params.id));
  res.status(HTTP_STATUS.NO_CONTENT).send();
});