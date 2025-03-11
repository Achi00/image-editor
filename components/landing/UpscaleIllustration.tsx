import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const UpscaleIllustration = () => {
  return (
    <div className="p-6 bg-gray-100 rounded-2xl border-2">
      <div className="flex flex-col gap-5 xl:flex-row justify-between">
        <div>
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex justify-between flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <Image
                  width={300}
                  height={300}
                  src="https://res.cloudinary.com/dle6xv667/image/upload/c_scale,w_140/v1741605026/test_u56x1i.png"
                  alt="Original image"
                  className="rounded-md border-2 border-black"
                />
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
                  width={300}
                  height={300}
                  src="https://res.cloudinary.com/dle6xv667/image/upload/v1741605042/ImagineAI-1741470452612_jowuan.png"
                  alt="Background removed"
                />
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
              Increased image resolution
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold tracking-tight">
            Image Upscaling
          </h2>
          <p className="leading-7 text-lg [&:not(:first-child)]:mt-2">
            Upload an image with low resolution and let AI enhance it to a
            higher resolution for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpscaleIllustration;
