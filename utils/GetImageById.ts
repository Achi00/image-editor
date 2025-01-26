import { FaceSwapImageSelect } from "@/types";

export function getImageById(
  id: number,
  galleryImages: FaceSwapImageSelect[]
): string {
  const selectedImage = galleryImages.filter((image) => image.id === id);
  return selectedImage[0]?.imgUrl;
}
