import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import {
  Calendar,
  FolderOpen,
  ImageIcon,
  Images,
  Info,
  Trash2,
} from "lucide-react";
import useLocalStorageStore from "@/store/useLocalStorage";
import { LocalStorageProps } from "@/types";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

const YourImages = () => {
  // stete to check if the image added
  const [showNotification, setShowNotification] = useState(false);
  // get images from zustand selector for memoization
  const images = useLocalStorageStore((state) => state.images);

  // Ref to track previous images length
  const prevImagesLength = useRef(images.length);
  // Ref to skip the first render
  const isFirstRender = useRef(true);
  // FIX: still shows up onMount
  // show message when new image is added
  useEffect(() => {
    const previousLength = prevImagesLength.current;
    const currentLength = images.length;

    // Skip effect on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevImagesLength.current = currentLength;
      return;
    }

    // Only show notification if:
    // We have existing images and new ones are added, OR
    // We're adding the first image to an empty array
    if (
      currentLength > previousLength &&
      !(previousLength === 0 && isFirstRender.current)
    ) {
      setShowNotification(true);
    }

    // Update the previous length
    prevImagesLength.current = currentLength;
  }, [images]);

  /* 
    get filtered images by imageFrom property do display them in different 
    sections of user images modal
  */

  //  useMemo to avoid unneccessary calculations on every re-render

  /* images are refference type by in this case it is fine,
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

  const enhanceImages = useMemo(
    () => images.filter((image) => image.imageFrom === "enhance"),
    [images]
  );

  return (
    <>
      {/* show notification if new image ha been added */}
      {showNotification && <NewImagePopover />}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-44" variant="outline">
            <Images /> View Your Images
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[500px]"
          side="top"
          align="center"
          sideOffset={5}
        >
          <div className="p-4 bg-muted">
            <h4 className="font-medium">Recent Images</h4>
          </div>
          <Tabs className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="remove-bg">Remove BG</TabsTrigger>
              <TabsTrigger value="face-swap">Face Swap</TabsTrigger>
              <TabsTrigger value="enhance">Enhance</TabsTrigger>
            </TabsList>

            <TabsContent value="remove-bg">
              {removeBgImages.length > 0 ? (
                <ImageSection
                  images={removeBgImages}
                  title="Background Removed"
                />
              ) : (
                <NoContent sectionName="Remove Background" />
              )}
            </TabsContent>

            <TabsContent value="face-swap">
              {faceSwapImages.length > 0 ? (
                <ImageSection images={faceSwapImages} title="Face Swapped" />
              ) : (
                <NoContent sectionName="Face Swap" />
              )}
            </TabsContent>

            <TabsContent value="enhance">
              {enhanceImages.length > 0 ? (
                <ImageSection images={enhanceImages} title="Enhanced" />
              ) : (
                <NoContent sectionName="Enhance Image" />
              )}
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </>
  );
};

// display image components
const ImageSection = ({
  title,
  images,
}: {
  title: string;
  images: LocalStorageProps[];
}) => {
  const pathname = usePathname();
  const { removeImage } = useLocalStorageStore();
  return (
    <div className="mb-4">
      <h5 className="font-medium mb-2">{title}</h5>
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-auto p-2">
        {images.map((image) => (
          <div key={image.imgUrl} className="space-y-4 border-2 p-2 rounded-lg">
            <div className="relative aspect-square">
              <Link href={`${pathname}/?modal=${image.imgUrl}`}>
                <Image
                  src={image.imgUrl || "/placeholder.svg"}
                  alt={`${image.imageFrom} image`}
                  fill
                  className="object-cover cursor-pointer rounded-md"
                />
              </Link>
              <Button
                className="cursor-pointer relative z-10 m-2"
                variant="outline"
                onClick={() => removeImage(image.imgUrl)}
              >
                <Trash2 />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(image.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// if there are no images on any section
const NoContent = ({ sectionName }: { sectionName: string }) => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle className="flex items-center text-xl font-semibold text-gray-700">
        <FolderOpen className="mr-2 h-6 w-6 text-yellow-500" />
        No Content Available
      </CardTitle>
      <CardDescription>This section is currently empty</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center text-center space-y-4">
        <ImageIcon className="h-24 w-24 text-gray-400" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-600">
            You do not have any images in the{" "}
            <span className="font-bold text-primary">{sectionName}</span>{" "}
            section
          </p>
          <p className="text-sm text-gray-500">
            You can do {sectionName} process by navigating to{" "}
            <Link
              className="text-blue-800 underline font-semibold"
              href={
                sectionName === "Face Swap"
                  ? "face-swap"
                  : sectionName === "Remove Background"
                  ? "remove-bg"
                  : "enhance"
              }
            >
              {sectionName} page
            </Link>{" "}
            and start processing the image
          </p>
        </div>
        <div className="flex items-start bg-blue-50 text-blue-700 p-4 rounded-lg mt-4 w-full">
          <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">Your processed images will appare here</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// show popover whenever new image is saved in local storage
const NewImagePopover = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <Card className="w-44 mb-5">
      <div className="flex flex-col items-start bg-blue-50 text-blue-700 p-4 rounded-lg w-full">
        <div className="flex items-center gap-1 py-2 pb-4">
          <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">New image added!</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Check it out in your gallery.
        </p>
      </div>
    </Card>
  );
};

export default YourImages;
