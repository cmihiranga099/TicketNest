const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_API_BASE_URL = import.meta.env.DEV ? "http://localhost:4000" : "";
const SHOULD_GUARD_LOCALHOST = !RAW_API_BASE_URL;

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function normalizeBaseUrl(value: string | undefined) {
  if (!value) {
    return "";
  }
  return value.replace(/\/+$/, "");
}

function resolveBaseUrl() {
  const normalized = normalizeBaseUrl(RAW_API_BASE_URL);
  if (!normalized) {
    return DEFAULT_API_BASE_URL;
  }
  if (typeof window === "undefined") {
    return normalized;
  }
  if (!SHOULD_GUARD_LOCALHOST) {
    return normalized;
  }
  try {
    const parsed = new URL(normalized, window.location.origin);
    if (LOCAL_HOSTNAMES.has(parsed.hostname) && !LOCAL_HOSTNAMES.has(window.location.hostname)) {
      return "";
    }
  } catch {
    return normalized;
  }
  return normalized;
}

const API_BASE_URL = resolveBaseUrl();

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getToken() {
  return localStorage.getItem("ticketnest.token");
}

export function setToken(token: string) {
  localStorage.setItem("ticketnest.token", token);
  notifyAuthChange();
}

export function clearToken() {
  localStorage.removeItem("ticketnest.token");
  notifyAuthChange();
}

const AUTH_CHANGE_EVENT = "ticketnest:auth";

type TokenPayload = {
  id?: string;
  email?: string;
  role?: string;
};

function notifyAuthChange() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function decodeTokenPayload(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  try {
    return JSON.parse(atob(padded)) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenPayload(): TokenPayload | null {
  const token = getToken();
  return token ? decodeTokenPayload(token) : null;
}

export function isAdmin(): boolean {
  return getTokenPayload()?.role === "ADMIN";
}

export function subscribeAuthChange(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
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
