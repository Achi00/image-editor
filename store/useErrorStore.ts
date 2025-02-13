import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ErrorState {
  error: string | null;
  setError: (error: string) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>()(
  persist(
    (set) => ({
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "error-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// SSR-safe initialization
export const initializeErrorStore = (initialState?: Partial<ErrorState>) => {
  return useErrorStore.setState({
    error: null,
    ...initialState,
  });
};
