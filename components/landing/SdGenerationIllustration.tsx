import { ArrowRight, PlusCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import messi from "@/public/faces/face4.jpg";

const SdGenerationIllustration = () => {
  return (
    <div className="w-full p-6 bg-gray-100 rounded-2xl border-2">
      <div className="flex flex-col gap-5 xl:flex-row justify-between">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold tracking-tight">
            Face swap With Stable Diffusion Generated Image
          </h2>
          <p className="leading-7 text-lg [&:not(:first-child)]:mt-2">
            You are not limited by images, if you want more wide range of
            options you can generate new image with{" "}
            <span className="font-semibold">Stable Diffusion</span> by entering
            prompt, then uploading or choosing face image
          </p>
        </div>
        <div>
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex justify-between flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute -top-5 -left-4 flex items-center justify-center">
                  <div className="w-16 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                    Prompt
                  </div>
                </div>
                <div className="border-2 border-black rounded-md">
                  <p className="py-2 text-black pl-4 pr-24 font-bold">
                    Superman
                  </p>
                </div>
                {/* <Input readOnly={true} value="Superman" /> */}
              </div>
              <div className="p-2">
                <PlusCircle className="w-8 h-8 text-primary" color="black" />
              </div>
              {/* face image */}
              <div className="relative">
                <div className="bg-muted rounded-lg overflow-hidden border border-border">
                  <Image
                    width={350}
                    height={350}
                    src={messi}
                    alt="Second input image"
                    className="w-full h-full object-cover rounded-md border-2 border-black"
                  />
                </div>
                <div className="absolute -top-3 -left-3 flex items-center justify-center">
                  <div className="w-24 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                    Target Face
                  </div>
                </div>
              </div>
              <div className="p-4 rotate-90 md:rotate-0">
                <ArrowRight className="w-8 h-8 text-primary" color="black" />
              </div>

              {/* Result image */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 flex items-center justify-center">
                  <div className="w-16 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                    Result
                  </div>
                </div>
                <Image
                  width={400}
                  height={400}
                  src="https://res.cloudinary.com/dle6xv667/image/upload/v1740570338/n4bekasn65dwxv6temjm.jpg"
                  alt="Background removed"
                  className="rounded-md border-2 border-black"
                />
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
              Stable diffusion image generation was used with face swapping
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SdGenerationIllustration;
