// reuse my shared API request helper.
import { apiRequest } from "@/api/api-client.js";

// send login payload to the auth login endpoint.
export function loginUser(payload) {
  return apiRequest("/auth/login", {
    // post credentials as JSON.
    method: "POST",
    body: JSON.stringify(payload)
  });
}

// send registration payload to the auth register endpoint.
export function registerUser(payload) {
  return apiRequest("/auth/register", {
    // post credentials as JSON.
    method: "POST",
    body: JSON.stringify(payload)
  });
}
