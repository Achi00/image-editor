// src/store/userStore.ts
import { GetUserById } from "@/utils/GetUserById";
import { create } from "zustand";

// First, let's define the shape of our user data
interface User {
  id: string;
  // Add other user fields from your schema
}

// Define the store's state and actions
interface UserStore {
  // State
  users: Record<string, User>; // Cache users by their ID
  loadingUsers: Record<string, boolean>; // Track loading state for each user

  // Actions
  getUser: (userId: string) => Promise<User | null>;
  setUser: (user: User) => void;
  clearUsers: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: {},
  loadingUsers: {},

  getUser: async (userId: string) => {
    // Check if we already have the user in cache
    const existingUser = get().users[userId];
    if (existingUser) {
      return existingUser;
    }

    // Check if we're already loading this user
    if (get().loadingUsers[userId]) {
      // Wait for the existing request to complete
      while (get().loadingUsers[userId]) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return get().users[userId];
    }

    try {
      // Mark this user as loading
      set((state) => ({
        loadingUsers: { ...state.loadingUsers, [userId]: true },
      }));

      // Fetch the user from database
      const [user] = await GetUserById(userId);

      if (user) {
        // Store the user in our cache
        set((state) => ({
          users: { ...state.users, [userId]: user },
        }));
      }

      return user || null;
    } finally {
      // Clear loading state
      set((state) => ({
        loadingUsers: { ...state.loadingUsers, [userId]: false },
      }));
    }
  },

  setUser: (user: User) => {
    set((state) => ({
      users: { ...state.users, [user.id]: user },
    }));
  },

  clearUsers: () => {
    set({ users: {}, loadingUsers: {} });
  },
}));
