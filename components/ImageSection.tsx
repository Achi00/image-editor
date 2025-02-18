"use client";
import useLocalStorageStore from "@/store/useLocalStorage";
import { LocalStorageProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Calendar, Trash2 } from "lucide-react";

// display image components
export const ImageSection = ({
  title,
  images,
  className,
}: {
  title?: string;
  images: LocalStorageProps[];
  className?: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { removeImage } = useLocalStorageStore();

  const createModalLink = (imageUrl: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", imageUrl);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mb-4">
      <h5 className="font-medium mb-2">{title}</h5>
      <div className={className}>
        {images.map((image) => (
          <div
            key={image.imgUrl}
            className="space-y-4 border-2 p-2 rounded-lg max-w-[80vw] md:max-w-full sm:max-w-full"
          >
            <div className="relative aspect-square ">
              <Link href={createModalLink(image.imgUrl)}>
                <Image
                  loading={images.length > 15 ? "lazy" : "eager"}
                  quality={70}
                  src={image.imgUrl || "/placeholder.svg"}
                  alt={`${image.imageFrom} image`}
                  fill
                  className="object-cover cursor-pointer rounded-md hover:scale-[1.02]  transition-transform"
                />
              </Link>
              <Button
                className="cursor-pointer relative z-10 m-2"
                variant="outline"
                onClick={() => removeImage(image.imgUrl)}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(image.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="font-bold capitalize text-sm">
                {image &&
                  image?.imageFrom
                    ?.replace("-", " ")
                    .replace("remove bg", "Remove Background")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
