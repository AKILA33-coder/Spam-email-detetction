const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

export const api = {
  predict: (message) =>
    request("/predict", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  history: () => request("/history"),
  clearHistory: () => request("/history", { method: "DELETE" }),
  analytics: () => request("/analytics"),
  stats: () => request("/stats"),
  health: () => request("/health"),
};
