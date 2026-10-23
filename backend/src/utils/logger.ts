export type LogLevel = "info" | "warn" | "error";

export const LOG_LEVELS: readonly LogLevel[] = ["info", "warn", "error"];
export const isLogLevel = (value: string): value is LogLevel =>
  (LOG_LEVELS as readonly string[]).includes(value);

export interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: string;
}

// Buffer circular en memoria: conserva solo los últimos MAX_ENTRIES eventos
const MAX_ENTRIES = 500;
const entries: LogEntry[] = [];
let nextId = 1;

const COLORS: Record<LogLevel, string> = {
  info: "\x1b[32m", // verde
  warn: "\x1b[33m", // amarillo
  error: "\x1b[31m", // rojo
};
const RESET = "\x1b[0m";

const metaToText = (meta: unknown): string | undefined => {
  if (meta === undefined) return undefined;
  if (meta instanceof Error) return meta.stack ?? meta.message;
  try {
    return JSON.stringify(meta);
  } catch {
    return "[meta no serializable]";
  }
};

const write = (level: LogLevel, message: string, meta?: unknown): void => {
  const timestamp = new Date().toISOString();
  const metaText = metaToText(meta);

  entries.push({ id: nextId++, timestamp, level, message, ...(metaText !== undefined && { meta: metaText }) });
  if (entries.length > MAX_ENTRIES) entries.shift();

  const suffix = metaText === undefined ? "" : meta instanceof Error ? `\n${metaText}` : ` ${metaText}`;
  const line = `${timestamp} ${COLORS[level]}[${level.toUpperCase()}]${RESET} ${message}${suffix}`;

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
};

/** Devuelve los eventos más recientes primero, con filtro opcional por nivel. */
const getEntries = (options: { level?: LogLevel; limit?: number } = {}): LogEntry[] => {
  const { level, limit = 100 } = options;
  const filtered = level ? entries.filter((e) => e.level === level) : entries;
  return filtered.slice(-limit).reverse();
};

export const logger = {
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta),
  getEntries,
};