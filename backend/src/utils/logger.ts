type LogLevel = "info" | "warn" | "error";

const COLORS: Record<LogLevel, string> = {
  info: "\x1b[32m", // verde
  warn: "\x1b[33m", // amarillo
  error: "\x1b[31m", // rojo
};
const RESET = "\x1b[0m";

const serializeMeta = (meta: unknown): string => {
  if (meta === undefined) return "";
  if (meta instanceof Error) return `\n${meta.stack ?? meta.message}`;
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return " [meta no serializable]";
  }
};

const write = (level: LogLevel, message: string, meta?: unknown): void => {
  const timestamp = new Date().toISOString();
  const line = `${timestamp} ${COLORS[level]}[${level.toUpperCase()}]${RESET} ${message}${serializeMeta(meta)}`;

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
};

export const logger = {
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta),
};