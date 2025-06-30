// src/utils/apiClient.ts
import { useAuthStore } from "@/store/authStore";
import { parseJwt } from "./jwt";

const API_BASE = "http://localhost:5000";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const { token, setToken, clearToken } = useAuthStore.getState();

  if (!token) throw new Error("Not authenticated");

  const payload = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);

  // Check if token is expired or will expire in the next 60 seconds
  if (!payload?.exp || payload.exp < currentTime + 60) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Send cookies (if your refresh token is in a cookie)
    });

    if (!refreshRes.ok) {
      clearToken();
      throw new Error("Session expired. Please log in again.");
    }

    const refreshData = await refreshRes.json();
    setToken(refreshData.token);
  }

  // Proceed with actual request using fresh token
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${useAuthStore.getState().token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "API Error");
  }

  return res.json();
}
