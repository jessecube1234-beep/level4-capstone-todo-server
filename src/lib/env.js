// dotenv makes .env variables available on process.env.
import dotenv from "dotenv";

dotenv.config();

function parseOrigins(rawValue) {
  return String(rawValue || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

// Centralized config object with sensible local defaults.
export const env = {
  // HTTP port for Express server.
  port: Number(process.env.PORT || 3000),
  // Allowed frontend origins for CORS.
  corsOrigins: parseOrigins(
    process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "http://localhost:5173"
  ),
  // Secret used to sign and verify JWTs.
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret"
};
