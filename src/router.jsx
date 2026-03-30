// build browser routes for the SPA.
import { createBrowserRouter, Navigate } from "react-router-dom";
// use a protected wrapper so only logged-in users can reach private pages.
import { ProtectedRoute } from "@/auth/protected-route.jsx";
// import my page components.
import { LoginPage } from "@/pages/login.jsx";
import { RegisterPage } from "@/pages/register.jsx";
import { TodosPage } from "@/pages/todos.jsx";

// keep all route definitions in one place for easy maintenance.
export const appRouter = createBrowserRouter([
  // redirect the root path to the main todos screen.
  { path: "/", element: <Navigate to="/todos" replace /> },
  // expose auth screens publicly.
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    // wrap private children with ProtectedRoute.
    element: <ProtectedRoute />,
    // keep the primary app page under /todos.
    children: [{ path: "/todos", element: <TodosPage /> }]
  }
]);
