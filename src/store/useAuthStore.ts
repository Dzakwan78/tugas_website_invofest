import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  nim: string | null;
  nama: string | null;
  login: (nim: string, nama: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // Cek apakah sebelumnya sudah ada sesi login di localStorage
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  nim: localStorage.getItem("user_nim"),
  nama: localStorage.getItem("user_nama"),

  login: (nim, nama) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user_nim", nim);
    localStorage.setItem("user_nama", nama);
    set({ isAuthenticated: true, nim, nama });
  },

  logout: () => {
    localStorage.clear();
    set({ isAuthenticated: false, nim: null, nama: null });
  },
}));