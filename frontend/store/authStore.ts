import { create } from "zustand";

interface User {
  fullName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // set user to null initial
  user: null,
  // also the isAuthenticated to false
  isAuthenticated: false,
  // first 2 values set to default like user not exists or logged in

  // Now set the user to logged in and isAuthenticated true
  setUser: (user: User) => set({ user, isAuthenticated: true }), // This function is called when handleLogin
  // clear user will tell the app the user is logged out or not exists
  clearUser: () => set({ user: null, isAuthenticated: false }), // This function is called for logout
}));
