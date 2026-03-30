// use RouterProvider to render my route tree.
import { RouterProvider } from "react-router-dom";
// wrap routes with my auth provider so every page can read auth state.
import { AuthProvider } from "@/auth/auth-context.jsx";
// import the router config from a dedicated file.
import { appRouter } from "@/router.jsx";

// keep App focused on provider composition.
export function App() {
  return (
    // place AuthProvider at the top so auth context is available everywhere.
    <AuthProvider>
      {/* I render all routes and opt into the React Router v7 transition flag early. */}
      <RouterProvider router={appRouter} future={{ v7_startTransition: true }} />
    </AuthProvider>
  );
}
