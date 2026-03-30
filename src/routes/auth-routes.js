// Auth routes for register/login endpoints.
import { Router } from "express";
import { login, register } from "../controllers/auth-controller.js";
import { asyncHandler } from "../middleware/async-handler.js";

// Router scoped to /auth in app.js.
const authRouter = Router();

// POST /auth/register creates a new account.
authRouter.post("/register", asyncHandler(register));
// POST /auth/login authenticates and returns JWT.
authRouter.post("/login", asyncHandler(login));

export { authRouter };
