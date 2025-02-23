"use client";
import useLocalStorageStore from "@/store/useLocalStorageStore";
import { LocalStorageProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Calendar, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { DeleteImage } from "@/utils/DeleteImageFromDB";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
  // get user session
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // delete image from local storage or from database if user is authenticated
  const { removeImage } = useLocalStorageStore();

  const [allImages, setAllImages] = useState<LocalStorageProps[]>(images);

  const handleDelete = async (imgUrl: string) => {
    // if user is authenticated delete from database
    if (session?.user.id) {
      try {
        await DeleteImage(session, imgUrl);
        // update state with removing deleted image from array
        setAllImages((prevImg) =>
          prevImg.filter((img) => img.imgUrl !== imgUrl)
        );
        toast.success("Image Removed Successfully");
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
      }
    } else {
      // delete from local storage
      removeImage(imgUrl);
    }
  };

  const createModalLink = (imageUrl: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", imageUrl);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mb-4">
      <Toaster />
      <h5 className="font-medium mb-2">{title}</h5>
      <div className={className}>
        {allImages.map((image) => (
          <div
            key={image.imgUrl}
            className="space-y-4 border-2 p-2 rounded-lg max-w-[80vw] md:max-w-full sm:max-w-full"
          >
            <div className="relative aspect-square ">
              <Link href={createModalLink(image.imgUrl)}>
                <Image
                  loading={allImages.length > 15 ? "lazy" : "eager"}
                  quality={70}
                  src={image.imgUrl || "/placeholder.svg"}
                  alt={`${image.imageFrom} image`}
                  fill
                  className="object-cover cursor-pointer rounded-md hover:scale-[1.02]  transition-transform"
                />
              </Link>
              {/* TODO: delete from database or localstorage */}
              <Button
                className="cursor-pointer relative z-10 m-2"
                variant="outline"
                onClick={() => handleDelete(image.imgUrl)}
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
