
/**
 * Authentication utilities - ready for Supabase Auth
 * This file will handle authentication when Supabase is connected
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Mock auth functions - replace with real Supabase Auth later
export const authService = {
  async getCurrentUser(): Promise<User | null> {
    // TODO: Replace with Supabase Auth
    return null;
  },

  async signIn(email: string, password: string): Promise<User> {
    // TODO: Replace with Supabase Auth
    throw new Error('Authentication not implemented yet');
  },

  async signUp(email: string, password: string): Promise<User> {
    // TODO: Replace with Supabase Auth
    throw new Error('Authentication not implemented yet');
  },

  async signOut(): Promise<void> {
    // TODO: Replace with Supabase Auth
    console.log('Sign out not implemented yet');
  },
};

// Auth context hook placeholder
export const useAuth = () => {
  // TODO: Replace with real auth context when Supabase is connected
  return {
    user: null,
    loading: false,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
  };
};
