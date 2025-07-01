const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;

      return response.json();
    } catch (error) {
      console.error("Failed to fetch user", error);
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Save token
    return data.user;
  },

  async signUp(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data.user;
  },

  async signOut(): Promise<void> {
    localStorage.removeItem("token");
  },
};

export const useAuth = () => {
  return {
    user: null, // You can add state later via Zustand or React Context
    loading: false,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
  };
};
