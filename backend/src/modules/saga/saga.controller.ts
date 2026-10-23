import type { Request } from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getBody, parseId, requiredString } from "../../utils/validators.js";
import { sagaService, type SagaInput } from "./saga.service.js";

const parseInput = (req: Request): SagaInput => ({
  nombre: requiredString(getBody(req).nombre, "nombre", 150),
});

export const getSagas = asyncHandler(async (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ success: true, data: await sagaService.getAll() });
});

export const getSagaById = asyncHandler(async (req, res) => {
  const data = await sagaService.getById(parseId(req.params.id));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const createSaga = asyncHandler(async (req, res) => {
  const data = await sagaService.create(parseInput(req));
  res.status(HTTP_STATUS.CREATED).json({ success: true, data });
});

export const updateSaga = asyncHandler(async (req, res) => {
  const data = await sagaService.update(parseId(req.params.id), parseInput(req));
  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

export const deleteSaga = asyncHandler(async (req, res) => {
  await sagaService.remove(parseId(req.params.id));
  res.status(HTTP_STATUS.NO_CONTENT).send();
});