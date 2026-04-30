import { create } from "zustand";
import type { User } from "@/types/user";
import { setToken, removeToken, setUser, getToken, getUser } from "@/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
  updateUser: (patch: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) => {
    setToken(token);
    setUser(user);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = getToken();
    const user = getUser<User>();
    if (token && user) {
      set({ token, user, isAuthenticated: true });
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
