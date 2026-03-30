// read the API base URL from env and fall back to local server for dev.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

// centralize fetch behavior so all API calls share the same defaults.
export async function apiRequest(path, options = {}) {
  // separate incoming headers so I can merge them safely with defaults.
  const { headers: optionHeaders, ...restOptions } = options;

  // send the request to `${baseUrl}${path}` with JSON defaults.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      // always send JSON unless a caller overrides this header.
      "Content-Type": "application/json",
      // merge caller headers (like Authorization) without dropping Content-Type.
      ...(optionHeaders ?? {})
    }
  });

  // throw useful API errors so UI code can show friendly messages.
  if (!response.ok) {
    // try reading JSON error payload first, then fall back to a generic message.
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Request failed");
  }

  // return null for 204 responses because there is no body to parse.
  if (response.status === 204) {
    return null;
  }

  // parse and return JSON for normal successful responses.
  return response.json();
}
