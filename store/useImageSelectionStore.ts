import { create } from "zustand";

type ImageSelectionStore = {
  selectedSourceId: number | null;
  selectedTargetId: number | null;
  selectedBackgroundSourceUrl: string | null;
  actions: {
    setSelectedBackgroundSourceId: (id: number | null) => void;
    setSelectedTargetFaceId: (id: number | null) => void;
    setSelectedBackgroundSourceUrl: (url: string | null) => void;
  };
};

type ImageState = {
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
  resetImage: () => void;
};

const useImageSelectionStore = create<ImageSelectionStore>((set) => ({
  selectedSourceId: null,
  selectedTargetId: null,
  selectedBackgroundSourceUrl: null,
  actions: {
    setSelectedBackgroundSourceId: (id) => set({ selectedSourceId: id }),
    setSelectedTargetFaceId: (id) => set({ selectedTargetId: id }),
    setSelectedBackgroundSourceUrl: (url) =>
      set({ selectedBackgroundSourceUrl: url }),
  },
}));

export const useImageStore = create<ImageState>((set) => ({
  imageUrl: null,
  setImageUrl: (url) => set({ imageUrl: url }),
  resetImage: () => set({ imageUrl: null }),
}));

// Selectors
export const useSelectedSourceId = () =>
  useImageSelectionStore((state) => state.selectedSourceId);
export const useSelectedTargetId = () =>
  useImageSelectionStore((state) => state.selectedTargetId);
export const useImageActions = () =>
  useImageSelectionStore((state) => state.actions);
export const useSelectedBackgroundSourceUrl = () =>
  useImageSelectionStore((state) => state.selectedBackgroundSourceUrl);
