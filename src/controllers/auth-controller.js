// Auth controller handles register/login business logic.
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";

// Normalize emails so auth lookups are consistent.
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function register(req, res) {
  // Read and normalize incoming credentials.
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  // Validate required fields.
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Enforce minimum password length.
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  // Block duplicate registrations by email.
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  // Hash password before storing.
  const passwordHash = await bcrypt.hash(password, 10);
  // Create user and return minimal safe user data.
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true }
  });

  // Return JWT so client can start authenticated session immediately.
  return res.status(201).json({
    user,
    token: signToken(user.id)
  });
}

export async function login(req, res) {
  // Read and normalize incoming credentials.
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  // Validate required fields.
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Look up user by normalized email.
  const user = await prisma.user.findUnique({ where: { email } });

  // Reject unknown users.
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare provided password with stored hash.
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  // Reject incorrect password.
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Return safe user info + fresh JWT.
  return res.json({
    user: { id: user.id, email: user.email },
    token: signToken(user.id)
  });
}
