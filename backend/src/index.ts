import "reflect-metadata";
import cors from "cors";
import express from "express";
import { ENV, HTTP_STATUS } from "./constants/index.js";
import { AppDataSource } from "./database/data-source.js";
import { errorHandler, notFoundHandler } from "./middlewares/errors.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { logger } from "./utils/logger.js";
import { seedAdminUser } from "./database/seeders/admin.seeder.js";
import { authRouter } from "./modules/user/user.routes.js";

const app = express();

// Middlewares globales (el logger va primero para medir el ciclo completo)
app.use(requestLogger);
app.use(cors());
app.use(express.json());

// Ruta de verificación
app.get("/api/health", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() },
  });
});

// Las rutas de negocio:
app.use("/api/auth", authRouter);
// app.use("/api/books", booksRouter);

// El manejo de errores SIEMPRE va al final
app.use(notFoundHandler);
app.use(errorHandler);

const bootstrap = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info(`Conexión a MySQL establecida (${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME})`);
    await seedAdminUser();

    const server = app.listen(ENV.PORT, () => {
      logger.info(`Servidor escuchando en http://localhost:${ENV.PORT} [${ENV.NODE_ENV}]`);
    });

    const shutdown = (signal: string): void => {
      logger.warn(`${signal} recibido. Cerrando servidor...`);
      server.close(async () => {
        await AppDataSource.destroy();
        logger.info("Servidor y conexión a la base de datos cerrados");
        process.exit(0);
      });
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error("No se pudo iniciar la aplicación", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logger.error("Promesa rechazada sin manejar", reason);
});
process.on("uncaughtException", (error) => {
  logger.error("Excepción no capturada", error);
  process.exit(1);
});

void bootstrap();