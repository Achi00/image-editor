"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Eraser } from "lucide-react";
import Link from "next/link";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useEffect, useState } from "react";

export const GalleryButtons = ({ filterParam }: { filterParam?: string }) => {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to desktop view during SSR
  const isMobile = mounted ? width < 768 : false;

  const buttons = [
    {
      label: "All",
      filter: "",
      children: (
        <Link href="/gallery" prefetch={true}>
          All
        </Link>
      ),
    },
    {
      label: "Remove Background",
      filter: "remove-bg",
      children: (
        <Link
          className="flex gap-3 items-center"
          href="/gallery?filter=remove-bg"
          prefetch={true}
        >
          <Eraser />
          {(!mounted || !isMobile) && "Remove Background"}
        </Link>
      ),
    },
    {
      label: "Face Swap",
      filter: "face-swap",
      children: (
        <Link
          className="flex gap-3 items-center"
          href="/gallery?filter=face-swap"
          prefetch={true}
        >
          <ArrowLeftRight />
          {(!mounted || !isMobile) && "Face Swap"}
        </Link>
      ),
    },
  ];

  return (
    <div className="w-full flex p-4 gap-8 justify-center items-center">
      {buttons.map((button) => (
        <Button
          key={button.label}
          variant="outline"
          className={`
            transition-all duration-200 ease-in-out
            ${
              (filterParam === undefined && button.filter === "") ||
              filterParam === button.filter
                ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                : "border-input hover:bg-accent hover:text-accent-foreground"
            }
          `}
        >
          {button.children}
        </Button>
      ))}
    </div>
  );
};
