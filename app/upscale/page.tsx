"use client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { upscaleImage } from "@/utils/Upscale";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowUpCircle,
  Upload,
  ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const Page = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upscaleMutation = useMutation({
    mutationFn: upscaleImage,
  });
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpscale = () => {
    if (selectedImage) {
      console.log(selectedImage);
      console.log(previewUrl);
      console.log(fileInputRef.current);
      // upscaleMutation.mutate(selectedImage);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    upscaleMutation.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg my-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <ArrowUpCircle className="h-6 w-6" />
          Image Upscaler
        </CardTitle>
        <CardDescription>
          Upload an image and we will enhance its resolution
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Drag and drop an image here, or click to select a file
          </p>
        </div>

        {previewUrl && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Selected Image
            </h3>
            <div className="relative rounded-lg overflow-hidden border border-muted">
              <Image
                width={550}
                height={550}
                src={previewUrl || "/placeholder.svg"}
                alt="Selected image preview"
                className="object-contain w-full max-h-64"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-3 right-3 opacity-90 hover:opacity-100"
                onClick={handleClear}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        )}

        {upscaleMutation.isSuccess &&
          upscaleMutation.data?.upscaledImageUrl && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Upscaled Image
              </h3>
              <div className="rounded-lg overflow-hidden border border-muted">
                <Image
                  width={550}
                  height={550}
                  src={
                    upscaleMutation.data.upscaledImageUrl || "/placeholder.svg"
                  }
                  alt="Upscaled image"
                  className="object-contain w-full max-h-64"
                />
              </div>
            </div>
          )}

        {upscaleMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {upscaleMutation.error instanceof Error
                ? upscaleMutation.error.message
                : "An error occurred during upscaling. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {upscaleMutation.isPending && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Upscaling in progress...</p>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="ghost"
          onClick={handleClear}
          disabled={!selectedImage && !upscaleMutation.isSuccess}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
        <Button
          onClick={handleUpscale}
          disabled={!selectedImage || upscaleMutation.isPending}
        >
          <ArrowUpCircle className="h-4 w-4 mr-1" />
          Upscale Image
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Page;
