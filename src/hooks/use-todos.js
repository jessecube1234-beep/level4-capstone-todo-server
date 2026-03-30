// This hook centralizes todo/tag loading and mutations for the Todos page.
import { useCallback, useEffect, useState } from "react";
import {
  createTag,
  createTodo,
  deleteTag,
  deleteTodo,
  fetchTags,
  fetchTodos,
  updateTodo
} from "@/api/todos-api.js";

export function useTodos(token) {
  // Local state for todo/tag data and request status.
  const [todos, setTodos] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial + refresh loader (pull todos and tags together).
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch both resources in parallel for faster page load.
      const [nextTodos, nextTags] = await Promise.all([fetchTodos(token), fetchTags(token)]);
      setTodos(nextTodos);
      setTags(nextTags);
    } catch (loadError) {
      setError(loadError.message || "Could not load your data.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Load data when token becomes available or changes.
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create a todo then prepend it in local UI state.
  async function addTodo(title, tagId) {
    const createdTodo = await createTodo(token, { title, tagId: tagId || null });
    setTodos((previousTodos) => [createdTodo, ...previousTodos]);
  }

  // Toggle completed flag and replace the updated item in UI state.
  async function toggleTodo(todo) {
    const updatedTodo = await updateTodo(token, todo.id, { completed: !todo.completed });

    setTodos((previousTodos) =>
      previousTodos.map((currentTodo) =>
        currentTodo.id === todo.id ? updatedTodo : currentTodo
      )
    );
  }

  // Delete todo in API and remove it from local state.
  async function removeTodo(id) {
    await deleteTodo(token, id);
    setTodos((previousTodos) => previousTodos.filter((todo) => todo.id !== id));
  }

  // Create tag and keep tags sorted alphabetically.
  async function addTag(name) {
    const createdTag = await createTag(token, { name });
    setTags((previousTags) => [...previousTags, createdTag].sort((a, b) => a.name.localeCompare(b.name)));
  }

  // Delete tag and clear that tag relationship from any existing todos in UI.
  async function removeTag(id) {
    await deleteTag(token, id);
    setTags((previousTags) => previousTags.filter((tag) => tag.id !== id));
    setTodos((previousTodos) =>
      previousTodos.map((todo) => (todo.tagId === id ? { ...todo, tagId: null, tag: null } : todo))
    );
  }

  // Expose state + actions to consuming components.
  return {
    todos,
    tags,
    isLoading,
    error,
    loadData,
    addTodo,
    toggleTodo,
    removeTodo,
    addTag,
    removeTag
  };
}
