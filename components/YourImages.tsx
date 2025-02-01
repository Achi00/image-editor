import React, { useMemo } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ImageSection = ({
  title,
  images,
}: {
  title: string;
  images: LocalStorageProps[];
}) => {
  const { removeImage } = useLocalStorageStore();
  return (
    <div className="mb-4">
      <h5 className="font-medium mb-2">{title}</h5>
      <div className="grid grid-cols-2 gap-2">
        {images.map((image) => (
          <div key={image.imgUrl} className="space-y-1">
            <div className="relative aspect-square">
              <Image
                src={image.imgUrl || "/placeholder.svg"}
                alt={`${image.imageFrom} image`}
                fill
                className="object-cover cursor-pointer rounded-md"
              />
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

const YourImages = () => {
  const { images } = useLocalStorageStore();

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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
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
            {removeBgImages.length > 0 ? (
              <ImageSection images={faceSwapImages} title="Face Swapped" />
            ) : (
              <NoContent sectionName="Face Swap" />
            )}
          </TabsContent>

          <TabsContent value="enhance">
            {removeBgImages.length > 0 ? (
              <ImageSection images={enhanceImages} title="Enhanced" />
            ) : (
              <NoContent sectionName="Enhance Image" />
            )}
          </TabsContent>
        </Tabs>
        {/* <div className="p-4 max-h-[400px] overflow-y-auto">
          {removeBgImages.length > 0 && (
            <ImageSection title="Remove Background" images={removeBgImages} />
          )}
          {faceSwapImages.length > 0 && (
            <ImageSection title="Face Swap" images={faceSwapImages} />
          )}
          {enhanceImages.length > 0 && (
            <ImageSection title="Enhance" images={enhanceImages} />
          )}
        </div> */}
      </PopoverContent>
    </Popover>
  );
};

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
            Upload some images to get started with processing
          </p>
        </div>
        <div className="flex items-start bg-blue-50 text-blue-700 p-4 rounded-lg mt-4 w-full">
          <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            To add images, use the upload button or drag and drop files into
            this section.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default YourImages;
