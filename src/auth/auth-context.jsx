// use React state/memo to hold and expose auth session data.
import { useMemo, useState } from "react";
// keep token persistence concerns in a dedicated helper module.
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken
} from "@/auth/token-storage.js";

// import the shared context object used by useAuth().
import { AuthContext } from "@/auth/auth-context-object.js";

// wrap the app and provide auth helpers + auth state to descendants.
export function AuthProvider({ children }) {
  // initialize token from localStorage so refresh keeps the user logged in.
  const [token, setToken] = useState(() => getStoredToken());

  // memoize the value object so consumers only re-render when token changes.
  const value = useMemo(
    () => ({
      // expose the raw token for API calls.
      token,
      // expose a boolean that simplifies route guarding and UI conditions.
      isAuthenticated: Boolean(token),
      // log in by persisting token and syncing state.
      login(nextToken) {
        setStoredToken(nextToken);
        setToken(nextToken);
      },
      // log out by clearing storage and state.
      logout() {
        clearStoredToken();
        setToken(null);
      }
    }),
    [token]
  );

  // provide auth state/helpers to all children in the tree.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
