// src/lib/authFetch.ts
import { useAuthStore } from "../store/authStore";

export const authFetch = async (
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> => {
  const token = useAuthStore.getState().token || localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    credentials: "include", // required to send cookies for refresh
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // Handle access token expiry
  if (response.status === 401 && retry) {
    try {
      const refreshRes = await fetch("http://localhost:5000/auth/refresh", {
        method: "POST",
        credentials: "include", // ⬅️ Send refresh token cookie
      });

      const data = await refreshRes.json();

      if (refreshRes.ok && data.token) {
        // Save new token in Zustand + localStorage
        useAuthStore.getState().setToken(data.token);
        localStorage.setItem("token", data.token);

        // Retry original request once
        return authFetch(url, options, false);
      } else {
        useAuthStore.getState().setToken(null);
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
      }
    } catch (err) {
      useAuthStore.getState().setToken(null);
      localStorage.removeItem("token");
      throw new Error("Token refresh failed. Please login again.");
    }
  }

  return response;
};
