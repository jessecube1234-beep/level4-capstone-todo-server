// This hook exposes auth context with a safety guard.
import { useContext } from "react";
import { AuthContext } from "@/auth/auth-context-object.js";

export function useAuth() {
  // Read the current auth context value from provider.
  const context = useContext(AuthContext);

  // Throw early if the hook is used outside AuthProvider.
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  // Return token + helpers defined in auth-context.jsx.
  return context;
}
