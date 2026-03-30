// requireAuth validates Bearer token and attaches user id to req.user.
import { verifyToken } from "../lib/jwt.js";

export function requireAuth(req, res, next) {
  // Read Authorization header from incoming request.
  const authHeader = req.headers.authorization;

  // Enforce expected "Bearer <token>" format.
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }

  // Strip "Bearer " prefix and normalize whitespace.
  const token = authHeader.slice("Bearer ".length).trim();

  try {
    // Verify token and attach current user context to request.
    const payload = verifyToken(token);
    req.user = { id: payload.userId };
    return next();
  } catch {
    // Reject invalid/expired tokens.
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
