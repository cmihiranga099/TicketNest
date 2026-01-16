import jwt from "jsonwebtoken";
import type { UserRole } from "../types/models.js";

const jwtSecret = process.env.JWT_SECRET || "change_me";
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "change_me_too";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export function signAccessToken(payload: { id: string; role: UserRole; email: string }) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function signRefreshToken(payload: { id: string; role: UserRole; email: string }) {
  return jwt.sign(payload, jwtRefreshSecret, { expiresIn: jwtRefreshExpiresIn });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, jwtSecret) as { id: string; role: UserRole; email: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, jwtRefreshSecret) as { id: string; role: UserRole; email: string };
}
