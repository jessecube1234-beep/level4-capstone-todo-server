// reuse my shared request helper so all API calls behave consistently.
import { apiRequest } from "@/api/api-client.js";

// generate the Bearer token header for protected endpoints.
function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`
  };
}

// fetch all todos for the currently authenticated user.
export function fetchTodos(token) {
  return apiRequest("/todos", {
    headers: authHeaders(token)
  });
}

// create a new todo.
export function createTodo(token, payload) {
  return apiRequest("/todos", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

// update an existing todo by id.
export function updateTodo(token, id, payload) {
  return apiRequest(`/todos/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

// delete a todo by id.
export function deleteTodo(token, id) {
  return apiRequest(`/todos/${id}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
}

// fetch all tags for the current user.
export function fetchTags(token) {
  return apiRequest("/tags", {
    headers: authHeaders(token)
  });
}

// create a tag for the current user.
export function createTag(token, payload) {
  return apiRequest("/tags", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

// delete a tag by id.
export function deleteTag(token, id) {
  return apiRequest(`/tags/${id}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
}
