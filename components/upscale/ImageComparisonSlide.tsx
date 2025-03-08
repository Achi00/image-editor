"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: "square" | "video" | "wide" | string;
  className?: string;
}

export function ImageComparisonSlide({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  aspectRatio = "video",
  className = "",
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "wide":
        return "aspect-[21/9]";
      default:
        return aspectRatio;
    }
  };

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      let clientX: number;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerLeft = containerRect.left;

      // Calculate position as percentage
      let newPosition = ((clientX - containerLeft) / containerWidth) * 100;

      // Clamp position between 0 and 100
      newPosition = Math.max(0, Math.min(100, newPosition));

      setSliderPosition(newPosition);
    },
    [isDragging]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-lg border ${getAspectRatioClass()} ${className}`}
    >
      {/* Before Image (right side of slider) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          width={550}
          height={550}
          src={beforeImage || "/placeholder.svg"}
          alt={beforeLabel}
          className="absolute select-none pointer-events-none inset-0 object-cover w-full h-full"
        />
        {beforeLabel && (
          <span className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 text-sm rounded">
            {beforeLabel}
          </span>
        )}
      </div>

      {/* After Image (left side of slider) with clip path */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <Image
          width={550}
          height={550}
          src={afterImage || "/placeholder.svg"}
          alt={afterLabel}
          className="absolute select-none pointer-events-none inset-0 object-cover w-full h-full"
        />
        {afterLabel && (
          <span className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 text-sm rounded">
            {afterLabel}
          </span>
        )}
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.7)] z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
