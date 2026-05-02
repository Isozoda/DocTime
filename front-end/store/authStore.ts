import { create } from "zustand";
import type { User } from "@/types/user";
import { setToken, removeToken, setUser, getToken, getUser } from "@/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const getInitialState = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false, isHydrated: false };
  }
  const token = getToken();
  const user = getUser<User>();
  if (token && user) {
    return { user, token, isAuthenticated: true, isHydrated: true };
  }
  return { user: null, token: null, isAuthenticated: false, isHydrated: true };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...getInitialState(),

  login: (user, token) => {
    setToken(token);
    setUser(user);
    set({ user, token, isAuthenticated: true, isHydrated: true });
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    // Eagerly hydrated in getInitialState for client-side
    const token = getToken();
    const user = getUser<User>();
    if (token && user) {
      set({ token, user, isAuthenticated: true, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },

  updateUser: (patch) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...patch };
    setUser(updated);
    set({ user: updated });
  },
}));
