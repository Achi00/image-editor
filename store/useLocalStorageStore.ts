import { LocalStorageProps } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocalStorageStore {
  images: LocalStorageProps[];
  addImage: (image: LocalStorageProps) => void;
  removeImage: (imgUrl: string) => void;
}

const useLocalStorageStore = create<LocalStorageStore>()(
  persist(
    (set) => ({
      images: [],
      addImage: (image) =>
        set((state) => ({ images: [...state.images, image] })),
      removeImage: (imgUrl) =>
        set((state) => ({
          images: state.images.filter((image) => image.imgUrl !== imgUrl),
        })),
    }),
    {
      name: "images",
    }
  )
);

export default useLocalStorageStore;
