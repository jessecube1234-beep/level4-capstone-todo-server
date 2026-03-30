// Todo routes are all protected by JWT auth middleware.
import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo
} from "../controllers/todos-controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireAuth } from "../middleware/require-auth.js";

// Router scoped to /todos in app.js.
const todosRouter = Router();

// Enforce auth for every todo endpoint below.
todosRouter.use(requireAuth);
// GET /todos lists current user's todos.
todosRouter.get("/", asyncHandler(getTodos));
// POST /todos creates a todo.
todosRouter.post("/", asyncHandler(createTodo));
// PATCH /todos/:id updates fields on a todo.
todosRouter.patch("/:id", asyncHandler(updateTodo));
// DELETE /todos/:id removes a todo.
todosRouter.delete("/:id", asyncHandler(deleteTodo));

export { todosRouter };
