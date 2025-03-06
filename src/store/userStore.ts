import { create } from "zustand";
import axios from "axios";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface UserState {
    users: User[];
    fetchUsers: () => Promise<void>;
    updateUser: (id: number, userData: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],

    fetchUsers: async () => {
        try {
            const response = await axios.get("https://dummyjson.com/users");
            set({ users: response.data.users || [] });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await axios.put(`https://dummyjson.com/users/${id}`, userData);
            set((state) => ({
                users: state.users.map(user =>
                    user.id === id ? { ...user, ...response.data } : user
                ),
            }));
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }
}));
