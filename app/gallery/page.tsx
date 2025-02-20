import { auth } from "@/lib/auth";
import { LocalStorageProps } from "@/types";
import { getAllUserImages } from "@/utils/GetUserImagesFromDb";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Eraser } from "lucide-react";
import { ImageSection } from "@/components/ImageSection";

// map over this
const buttons = [
  {
    label: "All",
    filter: "",
    children: <Link href="/gallery">All</Link>,
  },
  {
    label: "Remove Background",
    filter: "remove-bg",
    children: (
      <Link
        className="flex gap-3 items-center"
        href="/gallery?filter=remove-bg"
      >
        <Eraser />
        Remove Background
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
      >
        <ArrowLeftRight />
        Face Swap
      </Link>
    ),
  },
];

const page = async ({
  searchParams,
}: {
  searchParams: { filter?: string };
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
    // throw new Error("Unauthorized");
  }
  const filters = await searchParams;
  const filterParam = filters.filter;

  const images = (await getAllUserImages(
    session,
    filterParam
  )) as LocalStorageProps[];

  console.log("filterparams: " + filterParam);

  return (
    <div>
      <Suspense fallback="Loading images...">
        <div className="w-full flex p-4 gap-8 justify-center items-center ">
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
        <ImageSection
          className="grid xl:grid-cols-3 sm:grid-cols-1 gap-8 overflow-auto p-8"
          images={images}
        />
      </Suspense>
    </div>
  );
};

export default page;
