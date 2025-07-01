// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,

      setToken: (token) => {
        set({ token });
      },

      clearToken: () => {
        set({ token: null });
      },
    }),
    {
      name: "auth-token", // key in localStorage
      getStorage: () => localStorage, // explicitly use localStorage
    }
  )
);
