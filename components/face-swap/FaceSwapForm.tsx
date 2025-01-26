"use client";
import React, { memo, useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormFields } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { Images, Info, Loader2, X } from "lucide-react";
import { useFaceSwap } from "@/hooks/useFaceSwap";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import GalleryToggle from "./GalleryToggle";
import {
  useImageActions,
  useSelectedSourceId,
  useSelectedTargetId,
} from "@/store/useImageSelection";
import { galleryImages } from "@/lib/images";
import { getImageById } from "@/utils/GetImageById";
import ImageTabs from "./tabs/ImageTabs";
import ReusableHoverCard from "../ReusableHoverCard";

const FaceSwapForm = () => {
  // store image url
  const [image, setImage] = useState<string | null>();
  // custom fook to performe face swap and upload image into cloudinary
  const { mutateAsync, isPending, error } = useFaceSwap();
  // from zustand store
  // const selectedId = useSelectedImageId();
  // change selected target() image id globally
  const selectedSourceId = useSelectedSourceId();
  const selectedTargetId = useSelectedTargetId();
  const { setSelectedBackgroundSourceId, setSelectedTargetFaceId } =
    useImageActions();

  // return selected image if selected image id != null
  let selectedImage: string = "";
  if (selectedTargetId !== null) {
    selectedImage = getImageById(selectedTargetId, galleryImages);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (e) => {
    try {
      // Handle both cases: uploaded file OR gallery image
      let userImageFile: File;
      if (selectedTargetId !== null) {
        // Convert public image path to File object
        const publicImagePath = getImageById(selectedTargetId, galleryImages);
        const response = await fetch(publicImagePath);
        const blob = await response.blob();
        userImageFile = new File([blob], `gallery-image-${selectedTargetId}`, {
          type: blob.type,
        });
        console.log(publicImagePath);
        console.log(response);
        console.log(blob);
      } else {
        // Use uploaded file
        userImageFile = e.user_image[0];
      }
      const resUrl = await mutateAsync({
        // users image
        user_image: userImageFile,
        // image where face will be added
        generated_image_url: e.generated_image_url,
      });
      setImage(resUrl);
      console.log(resUrl);
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div className="flex items-center justify-center flex-col w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto mt-10 space-y-6"
      >
        <div className="flex flex-col gap-4">
          <Alert className="my-4">
            <Images className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold tracking-tight">
              Upload Image select one from gallery
            </AlertTitle>
            <AlertDescription className="leading-7 [&:not(:first-child)]:mt-2">
              If you dont want to upload your image, you can select one from our
              gallery by <span className="font-semibold">switching toggle</span>{" "}
              below, this image will be sellected as{" "}
              <span className="font-semibold">Target Face</span>
            </AlertDescription>
          </Alert>
          {/* toggle gallery is open value */}
          <GalleryToggle />

          {selectedTargetId === null ? (
            <Input
              id="user_image"
              type="file"
              accept="image/*"
              {...register("user_image")}
              className="mt-2 block w-full cursor-pointer"
            />
          ) : (
            // show selected image
            <div className="relative w-[250px] h-[250px] flex flex-col gap-3">
              <Image
                className="rounded-xl border-4 border-blue-500"
                src={selectedImage}
                alt="selected img"
                width={250}
                height={250}
              />
              <div
                className="absolute z-20 top-2 right-2 bg-gray-500 rounded-full p-1 cursor-pointer m-2"
                onClick={() => setSelectedTargetFaceId(null)}
              >
                <X className="text-white w-4 h-4" />
              </div>
              <div className="">
                <h4 className="text-xl font-semibold tracking-tight">
                  Target Face
                </h4>
                <ReusableHoverCard
                  contentClassName="w-80"
                  trigger={
                    <div className="flex items-center gap-2 pt-2 cursor-pointer hover:underline-offset-2">
                      <Info className="cursor-pointer w-3 h-3" />
                      <p>What is target face?</p>
                    </div>
                  }
                  content={
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          What is Target face?
                        </h4>
                        <p className="text-sm">
                          Target face it type of image where existing face will
                          be moved to main image which you can select below or
                          generate a new one with{" "}
                          <span className="font-semibold">
                            Stable Diffusion
                          </span>
                        </p>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          )}
          {errors.user_image && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.user_image.message}
            </p>
          )}
        </div>

        <div className="pt-16">
          {/* TODO: remove and switch it with image from below component or with generated one */}
          <Label htmlFor="generated_image_url">
            Generated Image URL (Face will be moved here)
          </Label>
          <Input
            id="generated_image_url"
            type="text"
            placeholder="Enter the generated image URL"
            {...register("generated_image_url")}
            className="mt-2 block w-full"
          />
          {errors.generated_image_url && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.generated_image_url.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full flex items-center gap-2"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Please wait
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>

      <div className="flex flex-col pt-5 items-center gap-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Select image or generate new with Stable Diffusion
        </h2>
        <Alert className="w-full">
          <Info className="h-4 w-4" />
          <AlertTitle>Main Image</AlertTitle>
          <AlertDescription>
            Selected image from this section will be used as main image, where{" "}
            <span className="font-semibold">Target Face</span> will be placed
          </AlertDescription>
        </Alert>
        <ImageTabs />
      </div>
    </div>
  );
};

export default memo(FaceSwapForm);
