
import { create } from "zustand";
import axios from "axios";

interface AuthState {
    isAuthenticated: boolean;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,

    login: async ({ username, password }) => {
        try {
            const response = await axios.post("https://dummyjson.com/auth/login", {
                username,
                password,
            });

            if (response.status === 200) {
                set({ isAuthenticated: true });
            }
        } catch (error: any) {
            throw new Error("Invalid username or password");
        }
    },

    logout: () => {
        set({ isAuthenticated: false });
    },
}));
