import { auth } from "@/lib/auth";
import { LocalStorageProps } from "@/types";
import { getAllUserImages } from "@/utils/GetUserImagesFromDb";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { ImageSection } from "@/components/ImageSection";
import { GalleryButtons } from "@/components/gallery/GalleryButtons";

interface PageProps {
  searchParams: {
    filter?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }
  const filters = await searchParams;
  const filterParam = filters.filter;

  const images = (await getAllUserImages(
    session,
    filterParam
  )) as LocalStorageProps[];

  return (
    <div>
      <Suspense fallback="Loading images...">
        <GalleryButtons filterParam={filterParam} />
        <ImageSection
          className="grid xl:grid-cols-3 sm:grid-cols-1 gap-8 overflow-auto p-8"
          images={images}
        />
      </Suspense>
    </div>
  );
};

export default Page;
