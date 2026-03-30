// ProtectedRoute blocks private pages unless a user is authenticated.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/use-auth.js";

export function ProtectedRoute() {
  // Read auth status and current location (for redirect-back behavior).
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If not logged in, send user to login and remember where they came from.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If logged in, render the matched child route.
  return <Outlet />;
}
