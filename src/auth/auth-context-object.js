// create a shared auth context that starts as null until provider mounts.
import { createContext } from "react";

export const AuthContext = createContext(null);
