import { HTTP_STATUS } from "../../constants/index.js";
import { AppError } from "../../middlewares/errors.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isLogLevel, logger, type LogLevel } from "../../utils/logger.js";
import { optionalQueryInt } from "../../utils/validators.js";

export const getLogs = asyncHandler(async (req, res) => {
  let level: LogLevel | undefined;
  const rawLevel = req.query.level;

  if (rawLevel !== undefined && rawLevel !== "") {
    if (typeof rawLevel !== "string" || !isLogLevel(rawLevel)) {
      throw AppError.validation('El parámetro "level" debe ser info, warn o error');
    }
    level = rawLevel;
  }

  const limit = optionalQueryInt(req.query.limit, "limit", 1, 500) ?? 100;

  res.status(HTTP_STATUS.OK).json({ success: true, data: logger.getEntries({ level, limit }) });
});