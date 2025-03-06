"use client";
import Image from "next/image";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import DownloadButton from "./DownloadButton";
import { useImageStore } from "@/store/useImageSelectionStore";

const ImageModal = () => {
  const router = useRouter();
  // get image url from modal url
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const modalUrl = searchParams.get("modal");
  // keep filter params
  const filterParam = searchParams.get("filter");
  // check if face swap image is saved in params
  const faceSwapImage = searchParams.get("faceSwapImage");

  // pass image url to download api
  const { setImageUrl } = useImageStore();

  useEffect(() => {
    if (modalUrl) {
      const hostName = new URL(modalUrl);
      if (
        hostName.hostname === "res.cloudinary.com" ||
        hostName.hostname === "replicate.delivery"
      ) {
        setImageUrl(modalUrl);
        document.body.style.overflow = "hidden";
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalUrl, setImageUrl]);

  // close modal and return to page where from image was open
  const handleClose = () => {
    // Construct the new URL with all necessary parameters
    const queryParams = new URLSearchParams();

    if (filterParam) {
      queryParams.set("filter", filterParam);
    }

    if (faceSwapImage) {
      queryParams.set("faceSwapImage", faceSwapImage);
    }

    const queryString = queryParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  if (!modalUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center p-4">
      <div className="relative max-w-5xl max-h-[90vh] w-full aspect-square flex items-center justify-center bg-white rounded-3xl">
        <Button
          className="absolute top-0 right-0 m-4 z-10"
          onClick={handleClose}
        >
          X
        </Button>
        <Image
          quality={70}
          src={modalUrl}
          alt="Modal image"
          fill
          className="object-contain rounded-lg"
          priority
        />
        <div className="absolute top-0 left-0 m-4">
          <DownloadButton />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
