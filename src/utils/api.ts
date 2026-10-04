// Central API client — all backend calls go through here so the base URL
// comes from the environment, never a hardcoded string.
//
// Local dev:  copy `.env.example` to `.env` (VITE_API_URL=http://localhost:5000)
// Production: set VITE_API_URL to the deployed backend URL before `vite build`.

export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ?? "http://localhost:5000";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, init);
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}
