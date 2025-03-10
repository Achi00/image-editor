"use client";
import { upscaleImage } from "@/utils/Upscale";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowUpCircle,
  Upload,
  AlertCircle,
  ImageIcon,
  Trash2,
  CheckCircle2,
  ZapIcon,
  Loader2,
  Lock,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import DownloadButton from "../DownloadButton";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { ImageComparisonSlide } from "./ImageComparisonSlide";
import Image from "next/image";
import { Session } from "next-auth";
import { useUserStore } from "@/store/useUserStore";
import { UserType } from "@/types";
import ReusableAlert from "../ReusableAlert";
import { useImageStore } from "@/store/useImageSelectionStore";
import GoogleButton from "../GoogleButton";

const ImageUpscaleForm = ({ session }: { session: Session | null }) => {
  // get user data by id
  const userId = session?.user.id;
  const getUser = useUserStore((state) => state.getUser);
  const user = useUserStore((state) => state.users[userId]) as UserType;

  // pass image url to download api
  const { setImageUrl } = useImageStore();

  // users remaining upscale processes
  const [upscaleCount, setUpscaleCount] = useState<number>(0);

  const [selectedImage, setSelectedImage] = useState<File | string | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>("");

  const [resultImg, setResultImg] = useState("");

  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      getUser(userId);
    } else if (user) {
      setUpscaleCount(user.upscale);
    }
  }, [getUser, user, userId]);

  const upscaleMutation = useMutation({
    mutationFn: upscaleImage,
    onSuccess: (data) => {
      if (data?.success && data.upscaledImageUrl) {
        setResultImg(data.upscaledImageUrl);
        // update zustand store image for download
        setImageUrl(data.upscaledImageUrl);
        // update upscale credits count
        setUpscaleCount(data.remainingUpscale);
        setError(null); // Clear any previous errors
      } else {
        setError(data?.error || "Failed to upscale image");
        // Clear any previous result
        setResultImg("");
      }
    },
    onError: (error) => {
      console.error("Upscale error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process image"
      );
      setResultImg("");
    },
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
    if (selectedImage && typeof selectedImage !== "string") {
      upscaleMutation.mutate({ image: selectedImage, userId: userId });
      setBeforeImage(previewUrl);
    }
  };

  const handleClear = () => {
    setError(null);
    setSelectedImage(null);
    setPreviewUrl(null);
    upscaleMutation.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUseExample = () => {
    const exampleImage =
      "https://res.cloudinary.com/dle6xv667/image/upload/v1741345757/test_dixeww.png";
    setSelectedImage(exampleImage);
    setPreviewUrl(
      "https://res.cloudinary.com/dle6xv667/image/upload/v1741345757/test_dixeww.png"
    );
    setBeforeImage(
      "https://res.cloudinary.com/dle6xv667/image/upload/v1741345757/test_dixeww.png"
    );
    // instead of passing selectedImage to image pass exampleImage to avoid useState async update problem
    upscaleMutation.mutate({ image: exampleImage, userId: userId });
  };
  if (!user) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                Authentication Required
              </CardTitle>
              <CardDescription>
                You need to be logged in to use our image upscaling service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our AI-powered image upscaling technology is available
                exclusively to registered users. Please log in or create an
                account to enhance your images.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <GoogleButton />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg my-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between gap-2">
          <div>
            <ArrowUpCircle className="h-6 w-6" />
            Image Upscaler
          </div>
          <div>
            <Button
              disabled={upscaleMutation.isPending || upscaleCount === 0}
              onClick={handleUseExample}
            >
              {upscaleCount === 0
                ? "You are out of credits"
                : "Use Example Image"}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Upload an image and we will enhance its resolution
        </CardDescription>
      </CardHeader>

      <div className="p-4">
        <ReusableAlert
          className={`my-4 ${
            upscaleCount >= 10 && "text-green-600 border-green-500"
          } ${
            upscaleCount < 10 &&
            upscaleCount > 5 &&
            "text-yellow-500 border-yellow-500"
          } ${upscaleCount < 5 && "text-red-600 border-red-500"}`}
          icon={<ZapIcon className="h-5 w-5" />}
          title={
            upscaleCount > 0
              ? "Upscale Credits"
              : "No Upscale Credits Remaining"
          }
          content={
            upscaleCount > 0
              ? `You have ${upscaleCount} out of 20 upscale credits remaining.`
              : "You've used all your upscale credits."
          }
        />
      </div>
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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}, Try Again with different image
            </AlertDescription>
          </Alert>
        )}

        {/* image preview */}
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
                disabled={upscaleMutation.isPending}
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

        {beforeImage && resultImg && (
          <ImageComparisonSlide
            afterImage={resultImg}
            beforeImage={beforeImage}
          />
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
        <DownloadButton
          isDisabled={upscaleMutation.isPending || resultImg === ""}
        />
        <Button
          onClick={handleUpscale}
          disabled={
            !selectedImage || upscaleMutation.isPending || upscaleCount === 0
          }
        >
          {upscaleMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              <p>Upscaling...</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 mr-1" />
              {upscaleCount === 0 ? "You are out of credits" : "Upscale Image"}
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUpscaleForm;
