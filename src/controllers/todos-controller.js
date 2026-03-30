// Todos controller handles CRUD logic for authenticated users.
import { prisma } from "../lib/prisma.js";

// Normalize title input so whitespace-only titles are rejected.
function normalizeTitle(title) {
  return String(title || "").trim();
}

export async function getTodos(req, res) {
  // Return only todos owned by the authenticated user.
  const todos = await prisma.todo.findMany({
    where: { userId: req.user.id },
    include: {
      tag: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return res.json(todos);
}

export async function createTodo(req, res) {
  // Normalize and parse input fields.
  const title = normalizeTitle(req.body.title);
  const tagId = req.body.tagId ? Number(req.body.tagId) : null;

  // Enforce required title.
  if (!title) {
    return res.status(400).json({ message: "Todo title is required" });
  }

  // If tag is provided, verify it belongs to current user.
  if (tagId) {
    const tag = await prisma.tag.findFirst({
      where: { id: tagId, userId: req.user.id }
    });

    if (!tag) {
      return res.status(400).json({ message: "Tag does not exist" });
    }
  }

  // Create todo and include tag details for immediate UI rendering.
  const todo = await prisma.todo.create({
    data: {
      title,
      userId: req.user.id,
      tagId
    },
    include: {
      tag: {
        select: { id: true, name: true }
      }
    }
  });

  return res.status(201).json(todo);
}

export async function updateTodo(req, res) {
  // Parse and validate id param.
  const todoId = Number(req.params.id);

  if (!Number.isInteger(todoId)) {
    return res.status(400).json({ message: "Invalid todo id" });
  }

  // Make sure target todo belongs to current user.
  const existingTodo = await prisma.todo.findFirst({
    where: { id: todoId, userId: req.user.id }
  });

  if (!existingTodo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Build patch object only from valid/allowed fields.
  const data = {};

  if (typeof req.body.title === "string") {
    const title = normalizeTitle(req.body.title);

    if (!title) {
      return res.status(400).json({ message: "Todo title cannot be empty" });
    }

    data.title = title;
  }

  // Handle completed flag update.
  if (typeof req.body.completed === "boolean") {
    data.completed = req.body.completed;
  }

  // Handle optional tag reassignment / unassignment.
  if (Object.prototype.hasOwnProperty.call(req.body, "tagId")) {
    if (req.body.tagId === null) {
      data.tagId = null;
    } else {
      const tagId = Number(req.body.tagId);

      if (!Number.isInteger(tagId)) {
        return res.status(400).json({ message: "Invalid tag id" });
      }

      const tag = await prisma.tag.findFirst({ where: { id: tagId, userId: req.user.id } });

      if (!tag) {
        return res.status(400).json({ message: "Tag does not exist" });
      }

      data.tagId = tagId;
    }
  }

  // Reject empty patch requests.
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  // Persist patch and return updated resource.
  const updatedTodo = await prisma.todo.update({
    where: { id: todoId },
    data,
    include: {
      tag: {
        select: { id: true, name: true }
      }
    }
  });

  return res.json(updatedTodo);
}

export async function deleteTodo(req, res) {
  // Parse and validate id param.
  const todoId = Number(req.params.id);

  if (!Number.isInteger(todoId)) {
    return res.status(400).json({ message: "Invalid todo id" });
  }

  // Make sure target todo belongs to current user.
  const existingTodo = await prisma.todo.findFirst({
    where: { id: todoId, userId: req.user.id }
  });

  if (!existingTodo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Delete resource and return 204 No Content.
  await prisma.todo.delete({ where: { id: todoId } });
  return res.status(204).send();
}
