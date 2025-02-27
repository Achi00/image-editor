import Image from "next/image";
import React from "react";

const RemoveBGIllustration = () => {
  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row justify-between">
        {/* Left side - Title and description */}
        <div className="w-1/3">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex justify-between flex-col md:flex-row items-center gap-2">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <Image
                  height={750}
                  width={750}
                  src="https://res.cloudinary.com/dle6xv667/image/upload/v1737909558/superman_mv6hmz.jpg"
                  alt="Original image"
                  className="object-cover rounded-md border"
                />
              </div>
              <div className="flex">
                {/* Arrow for mobile */}
                <div className="md:hidden flex items-center justify-center w-10 h-10 rotate-90">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center w-10 h-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>

              {/* Result image */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 flex items-center justify-center">
                  <div className="w-16 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                    Result
                  </div>
                </div>
                <Image
                  height={750}
                  width={750}
                  src="https://res.cloudinary.com/dle6xv667/image/upload/v1738314220/u8qoji6j5go2syt80oc9.png"
                  alt="Background removed"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
              The background from the original image is removed
            </div>
          </div>
        </div>
        <div className="md:w-1/3">
          <h1 className="text-3xl font-bold mb-4">Background Removal</h1>
          <p className="text-gray-600">
            Upload an image and remove its background instantly. Get a clean,
            transparent background perfect for product photos, portraits, and
            design projects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemoveBGIllustration;
