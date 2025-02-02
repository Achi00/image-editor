import ImageUploader from "@/components/remove-bg/ImageUploader";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="flex py-10 flex-col w-full items-center justify-center min-h-screen">
      <h1 className="scroll-m-20 text-3xl border-b-2 border-black font-extrabold tracking-tight lg:text-4xl">
        Remove Background By One Click
      </h1>
      <div className="mt-8 mb-10 w-full">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Image removal model is loaded locally on your browser</li>
            <li>
              You can start using it as soon as it loads and status code becames{" "}
              <span className="font-bold">Ready</span>
            </li>
            <li>
              All processes will happend on your device, no server side
              comunication is involved
            </li>
            <li>
              The processed image will appear in the &quot;Processed Image&quot;
              section.
            </li>
            <li>
              You will be able to Download your new image with a transparent
              background!
            </li>
          </ul>
        </CardContent>
      </div>
      <ImageUploader />
    </div>
  );
};

export default page;
