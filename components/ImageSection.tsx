"use client";
import useLocalStorageStore from "@/store/useLocalStorageStore";
import { LinkCardProps, LocalStorageProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Calendar, ImageOff, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { DeleteImage } from "@/utils/DeleteImageFromDB";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LinkCards from "./landing/LinkCards";
import { Links } from "@/app/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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

  useEffect(() => {
    setAllImages(images);
  }, [images]);

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

  const params = new URLSearchParams(searchParams.toString());

  const createModalLink = (imageUrl: string) => {
    params.set("modal", imageUrl);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mb-4">
      {allImages.length == 0 && (
        <Card className="w-full max-w-3xl mx-auto shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-muted rounded-full">
                <ImageOff className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              No images created for {params.toString().replace("filter=", "")}{" "}
              section
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Get started by generating your first image using one of the
              options below
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
              {Links.map((link: LinkCardProps) => (
                <LinkCards
                  key={link.id}
                  id={link.id}
                  Icon={link.Icon}
                  href={link.href}
                  heading={link.heading}
                  description={link.description}
                  status={link.status}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
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
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover cursor-pointer rounded-md hover:scale-[1.02]  transition-transform"
                />
              </Link>
              {/* delete from database or localstorage based on auth */}
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
