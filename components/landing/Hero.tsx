import Image from "next/image";
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import CoverImg from "@/public/cover.png";

const Hero = ({ authStatus }: { authStatus: string }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-100 to-white dark:from-indigo-950 dark:to-background">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {authStatus === "notAuthenticated" && (
          <div className="pb-24">
            <Alert
              variant="destructive"
              className="w-1/2 mx-auto border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/30"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-red-800 dark:text-red-200">
                Error
              </AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                Your access was denied because of your are not authenticated.
                Please log in again.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <div className="relative">
              <div className="absolute -bottom-4 -left-4 h-72 w-72 animate-blob rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
              <div className="absolute -top-4 -right-4 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-red-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
              <div className="absolute -bottom-8 left-20 h-72 w-72 animate-blob animation-delay-4000 rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Transform Your Images with AI
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Unleash the power of AI to swap faces, remove backgrounds, and
              enhance image quality in seconds.
            </p>
          </div>
          <div className="relative">
            <Image
              src={CoverImg}
              alt="AI Image Processing"
              width={600}
              height={400}
              className="rounded-lg shadow-xl border-2 border-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
