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
  user: null,
  isAuthenticated: false,

  // Called after successful login/register API response.
  // Only updates local UX state — does NOT grant backend access.
  // Actual auth check happens server-side via verifyJWT on every request.
  setUser: (user: User) => set({ user, isAuthenticated: true }),

  // Called on logout, or when a token refresh fails (e.g. 401 from backend).
  // Resets UI state only — cookie invalidation must happen server-side too.
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
