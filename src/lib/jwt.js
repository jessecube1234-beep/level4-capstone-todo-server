// JWT helper wraps token creation/verification in one place.
import jwt from "jsonwebtoken";
import { env } from "./env.js";

// Create auth token with user id and 7-day expiration.
export function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });
}

// Decode + verify token signature and expiration.
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
