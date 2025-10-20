// client/src/utils/api.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function api(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
    credentials: "include", // <<— SHUMË E RËNDËSISHME (dërgon cookie JWT)
  });

  let data = null;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && data.message) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
