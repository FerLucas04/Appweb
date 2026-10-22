import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BCRYPT_SALT_ROUNDS, ENV, JWT_EXPIRES_IN } from "../../constants/index.js";
import { AppError } from "../../middlewares/errors.js";
import { userRepository } from "./user.repository.js";
import type { User } from "./user.entity.js";

/** Datos del usuario que se pueden exponer al cliente **/
export interface PublicUser {
  id: number;
  email: string;
  nombre: string;
}

export interface LoginResult {
  token: string;
  user: PublicUser;
}

// Hash de relleno: si el email no existe, igual ejecutamos bcrypt.compare para que
// la respuesta tarde lo mismo y no se pueda deducir qué emails están registrados.
const DUMMY_HASH = bcrypt.hashSync("relleno-anti-timing", BCRYPT_SALT_ROUNDS);

const INVALID_CREDENTIALS = "Credenciales inválidas";

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  email: user.email,
  nombre: user.nombre,
});

const signToken = (user: User): string =>
  jwt.sign({ email: user.email, nombre: user.nombre }, ENV.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  });

const login = async (email: string, password: string): Promise<LoginResult> => {
  const user = await userRepository.findByEmail(email.trim().toLowerCase());

  const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  // Mensaje para "no existe" y "contraseña incorrecta"
  if (!user || !passwordMatches) {
    throw AppError.unauthorized(INVALID_CREDENTIALS);
  }

  return { token: signToken(user), user: toPublicUser(user) };
};

/** Valida firma y expiración del JWT y devuelve los datos del usuario de ese token. */
const verifyToken = (token: string): PublicUser => {
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET, { algorithms: ["HS256"] });

    if (typeof payload === "string") throw new Error("Payload inesperado");
    const id = Number(payload.sub);
    if (!Number.isInteger(id) || typeof payload.email !== "string" || typeof payload.nombre !== "string") {
      throw new Error("Payload incompleto");
    }

    return { id, email: payload.email, nombre: payload.nombre };
  } catch {
    throw AppError.unauthorized("Token inválido o expirado");
  }
};

/** Datos actuales del usuario en la base (para /me). */
const getProfile = async (id: number): Promise<PublicUser> => {
  const user = await userRepository.findById(id);
  if (!user) throw AppError.unauthorized("Token inválido o expirado");
  return toPublicUser(user);
};

export const authService = { login, verifyToken, getProfile };