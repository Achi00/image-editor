"use client";
import useLocalStorageStore from "@/store/useLocalStorageStore";
import { useMemo } from "react";

export const useLocalStorageImages = () => {
  const images = useLocalStorageStore((state) => state.images);
  /* 
    get filtered images by imageFrom property do display them in different 
    sections of user images modal
  */

  //  useMemo to avoid unneccessary calculations on every re-render

  /* 
    images are refference type but in this case it is fine,
    because we get zustand selector and not array itself
  */
  const removeBgImages = useMemo(
    () => images.filter((image) => image.imageFrom === "remove-bg"),
    [images]
  );

  const faceSwapImages = useMemo(
    () => images.filter((image) => image.imageFrom === "face-swap"),
    [images]
  );

  const upscaleImages = useMemo(
    () => images.filter((image) => image.imageFrom === "upscale"),
    [images]
  );
  return {
    removeBgImages,
    faceSwapImages,
    upscaleImages,
  };
};
