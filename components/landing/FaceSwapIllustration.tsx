import { ArrowRight, PlusCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

const FaceSwapIllustration = () => {
  return (
    <div className="flex p-4 justify-between flex-wrap items-center gap-4 bg-gray-100 rounded-2xl border-2">
      <div className="flex flex-col space-y-4 max-w-xl">
        <h2 className="text-3xl font-semibold tracking-tight">Face Swapping</h2>
        <p className="leading-7 text-lg [&:not(:first-child)]:mt-2">
          Combine 2 images into one, pick images by your choice and move face
          from one image to another with perfect shadows, lighting and mimics.
        </p>
      </div>
      <div className="sm:w-full bg-white rounded-md max-w-4xl mx-auto p-4">
        <div className="overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* First section - Input images */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* First input image */}
                <div className="relative">
                  <div className="bg-muted rounded-lg overflow-hidden border border-border">
                    <Image
                      width={350}
                      height={350}
                      src="https://res.cloudinary.com/dle6xv667/image/upload/v1737911024/Untitled-2_z8tqxz.jpg"
                      alt="First input image"
                      className="w-full h-full object-cover rounded-md border-2 border-black"
                    />
                  </div>
                  <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                </div>

                {/* Plus sign */}
                <div className="p-2">
                  <PlusCircle className="w-8 h-8 text-primary" color="black" />
                </div>

                {/* Second input image */}
                <div className="relative">
                  <div className="bg-muted rounded-lg overflow-hidden border border-border">
                    <Image
                      width={350}
                      height={350}
                      src="https://res.cloudinary.com/dle6xv667/image/upload/v1737909558/superman_mv6hmz.jpg"
                      alt="Second input image"
                      className="w-full h-full object-cover rounded-md border-2 border-black"
                    />
                  </div>
                  <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                </div>
              </div>

              {/* Arrow pointing to result */}
              <div className="p-4 rotate-90 md:rotate-0">
                <ArrowRight className="w-8 h-8 text-primary" color="black" />
              </div>

              {/* Result image */}
              <div className="relative">
                <div className="bg-muted rounded-lg overflow-hidden sm:w-[250px] sm:h-[250px] md:w-64 md:h-64 border border-border shadow-lg">
                  <Image
                    width={350}
                    height={350}
                    src="https://res.cloudinary.com/dle6xv667/image/upload/v1738526954/a9rvw0yvlqqbzgt8evy1.jpg"
                    alt="Result image"
                    className="w-full h-full object-cover rounded-md border-2 border-black"
                  />
                </div>
                <span className="absolute -top-2 -left-2 bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div className="absolute -top-3 -right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Result
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-muted-foreground">
              <p className="text-sm">
                The face from Image 1 is placed on Image 2
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceSwapIllustration;
