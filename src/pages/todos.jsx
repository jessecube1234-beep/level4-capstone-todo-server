// Todos page handles theme, todo/tag CRUD actions, and list filtering.
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/auth/use-auth.js";
import { useTodos } from "@/hooks/use-todos.js";

// Filter predicates for UI tabs.
const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed
};
// localStorage key used to persist current theme.
const THEME_STORAGE_KEY = "todo-theme";

export function TodosPage() {
  // Read auth token/logout and todo hook actions/state.
  const { token, logout } = useAuth();
  const { todos, tags, isLoading, error, addTodo, toggleTodo, removeTodo, addTag, removeTag } = useTodos(token);

  // Input/filter/error/theme state for this page.
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [selectedTagId, setSelectedTagId] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [actionError, setActionError] = useState("");
  // Initialize theme from localStorage, defaulting to dark.
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  });
  // Input refs provide a fallback read source during submit.
  const todoInputRef = useRef(null);
  const tagInputRef = useRef(null);
  // Label used in the theme toggle tooltip/aria text.
  const nextThemeLabel = theme === "dark" ? "light" : "dark";

  // Sync selected theme to DOM attribute + localStorage.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Compute visible todos based on current filter tab.
  const filteredTodos = useMemo(
    () => todos.filter(FILTERS[activeFilter]),
    [activeFilter, todos]
  );

  // Create todo flow.
  async function handleCreateTodo() {
    setActionError("");
    const stateValue = newTodoTitle ?? "";
    const refValue = todoInputRef.current?.value ?? "";
    const chosenValue = stateValue || refValue || "";
    const trimmedTitle = chosenValue.trim();

    if (!trimmedTitle) {
      setActionError("Todo title is required.");
      return;
    }

    try {
      // Send create request and clear input on success.
      await addTodo(trimmedTitle, selectedTagId ? Number(selectedTagId) : null);
      setNewTodoTitle("");
    } catch (createError) {
      setActionError(createError.message || "Could not create todo.");
    }
  }

  // Create tag flow.
  async function handleCreateTag() {
    setActionError("");
    const trimmedName = (newTagName || tagInputRef.current?.value || "").trim();

    if (!trimmedName) {
      setActionError("Tag name is required.");
      return;
    }

    try {
      // Send create request and clear input on success.
      await addTag(trimmedName);
      setNewTagName("");
    } catch (createError) {
      setActionError(createError.message || "Could not create tag.");
    }
  }

  return (
    <main className="todos-shell">
      <header className="hero-header">
        <h1>TODO</h1>
        <div className="hero-actions">
          {/* Theme toggle switches between dark and light palettes. */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
            aria-label={`Switch to ${nextThemeLabel} theme`}
            title={`Switch to ${nextThemeLabel} theme`}
          >
            <img
              // Show opposite icon to signal what click will switch to.
              src={theme === "dark" ? "/challenge/icon-sun.svg" : "/challenge/icon-moon.svg"}
              alt=""
              aria-hidden="true"
            />
          </button>
          {/* Logout clears auth token and returns to login flow via route guard. */}
          <button type="button" className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="todo-card">
        <div className="new-todo-form">
          <input
            ref={todoInputRef}
            type="text"
            placeholder="Create a new todo..."
            value={newTodoTitle}
            onChange={(event) => {
              setNewTodoTitle(event.target.value);
              // Clear stale action errors as user edits input.
              if (actionError) setActionError("");
            }}
            onKeyDown={(event) => {
              // Enter key submits current todo text.
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreateTodo();
              }
            }}
          />
          <select value={selectedTagId} onChange={(event) => setSelectedTagId(event.target.value)}>
            <option value="">No tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleCreateTodo}>Add</button>
        </div>

        <div className="new-tag-form">
          <input
            ref={tagInputRef}
            type="text"
            placeholder="Create tag"
            value={newTagName}
            onChange={(event) => {
              setNewTagName(event.target.value);
              // Clear stale action errors as user edits input.
              if (actionError) setActionError("");
            }}
            onKeyDown={(event) => {
              // Enter key submits current tag text.
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreateTag();
              }
            }}
          />
          <button type="button" onClick={handleCreateTag}>Add Tag</button>
        </div>

        {actionError ? <p className="error-text">{actionError}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {isLoading ? <p className="loading-text">Loading todos...</p> : null}

        {!isLoading ? (
          // Render current filtered list of todos.
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {
                      // Toggle completion and report any API failure.
                      toggleTodo(todo).catch((toggleError) => {
                        setActionError(toggleError.message || "Could not update todo.");
                      });
                    }}
                  />
                  <span className={todo.completed ? "completed" : ""}>{todo.title}</span>
                </label>
                <div className="todo-meta">
                  {todo.tag ? <small>{todo.tag.name}</small> : null}
                  <button
                    type="button"
                    onClick={() => {
                      // Delete todo and report any API failure.
                      removeTodo(todo.id).catch((removeError) => {
                        setActionError(removeError.message || "Could not delete todo.");
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <footer className="todo-footer">
          {/* Filter buttons map directly to FILTERS keys. */}
          <div className="filters">
            {Object.keys(FILTERS).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                className={activeFilter === filterKey ? "active" : ""}
                onClick={() => setActiveFilter(filterKey)}
              >
                {filterKey}
              </button>
            ))}
          </div>
        </footer>
      </section>

      <section className="tag-card">
        <h2>Tags</h2>
        <ul>
          {tags.map((tag) => (
            <li key={tag.id}>
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => {
                  // Delete tag and clear related API errors to screen.
                  removeTag(tag.id).catch((removeError) => {
                    setActionError(removeError.message || "Could not delete tag.");
                  });
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
