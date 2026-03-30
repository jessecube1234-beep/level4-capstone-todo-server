// Tags controller handles CRUD logic for authenticated users.
import { prisma } from "../lib/prisma.js";

// Normalize tag names so whitespace-only values are rejected.
function normalizeTagName(name) {
  return String(name || "").trim();
}

export async function getTags(req, res) {
  // Return only tags owned by the authenticated user.
  const tags = await prisma.tag.findMany({
    where: { userId: req.user.id },
    orderBy: { name: "asc" }
  });

  return res.json(tags);
}

export async function createTag(req, res) {
  // Normalize incoming name.
  const name = normalizeTagName(req.body.name);

  // Enforce required name.
  if (!name) {
    return res.status(400).json({ message: "Tag name is required" });
  }

  try {
    // Create tag scoped to current user.
    const tag = await prisma.tag.create({
      data: {
        name,
        userId: req.user.id
      }
    });

    return res.status(201).json(tag);
  } catch (error) {
    // Prisma P2002 = unique constraint violation (duplicate tag name per user).
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Tag already exists" });
    }

    // Re-throw unknown DB errors to global error middleware.
    throw error;
  }
}

export async function deleteTag(req, res) {
  // Parse and validate id param.
  const tagId = Number(req.params.id);

  if (!Number.isInteger(tagId)) {
    return res.status(400).json({ message: "Invalid tag id" });
  }

  // Make sure target tag belongs to current user.
  const existingTag = await prisma.tag.findFirst({
    where: { id: tagId, userId: req.user.id }
  });

  if (!existingTag) {
    return res.status(404).json({ message: "Tag not found" });
  }

  // Delete resource and return 204 No Content.
  await prisma.tag.delete({ where: { id: tagId } });

  return res.status(204).send();
}
