const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function getToken() {
  return localStorage.getItem("ticketnest.token");
}

export function setToken(token: string) {
  localStorage.setItem("ticketnest.token", token);
}

export function clearToken() {
  localStorage.removeItem("ticketnest.token");
}

async function request<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.error?.message || data?.error || response.statusText;
    throw new Error(message || "Request failed");
  }

  return data as T;
}

export const api = {
  request
};
