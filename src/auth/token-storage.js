// store the auth token under one stable localStorage key.
const TOKEN_KEY = "todo_app_token";

// read any saved token when the app boots.
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// save the token after login/register succeeds.
export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// clear the token on logout.
export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}
