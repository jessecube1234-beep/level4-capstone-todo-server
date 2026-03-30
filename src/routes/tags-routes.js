// Tag routes are all protected by JWT auth middleware.
import { Router } from "express";
import { createTag, deleteTag, getTags } from "../controllers/tags-controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireAuth } from "../middleware/require-auth.js";

// Router scoped to /tags in app.js.
const tagsRouter = Router();

// Enforce auth for every tag endpoint below.
tagsRouter.use(requireAuth);
// GET /tags lists current user's tags.
tagsRouter.get("/", asyncHandler(getTags));
// POST /tags creates a tag.
tagsRouter.post("/", asyncHandler(createTag));
// DELETE /tags/:id removes a tag.
tagsRouter.delete("/:id", asyncHandler(deleteTag));

export { tagsRouter };
