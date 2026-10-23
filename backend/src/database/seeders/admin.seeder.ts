import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS, ENV } from "../../constants/index.js";
import { userRepository } from "../../modules/user/user.repository.js";
import { logger } from "../../utils/logger.js";

export const seedAdminUser = async (): Promise<void> => {
  const totalUsers = await userRepository.count();

  if (totalUsers > 0) {
    logger.info("Seeder: ya existe un usuario administrador, no se crea otro");
    return;
  }

  const passwordHash = await bcrypt.hash(ENV.ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS);

  await userRepository.create({
    email: ENV.ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    nombre: ENV.ADMIN_NOMBRE,
  });

  logger.info(`Seeder: usuario administrador creado (${ENV.ADMIN_EMAIL})`);
};