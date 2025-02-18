import { auth } from "@/lib/auth";
import { LocalStorageProps } from "@/types";
import { getAllUserImages } from "@/utils/GetUserImagesFromDb";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Eraser } from "lucide-react";
import { ImageSection } from "@/components/ImageSection";

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
  console.log("searchParams: " + filters.filter);

  const images = (await getAllUserImages(
    session,
    filterParam
  )) as LocalStorageProps[];

  return (
    <div>
      <Suspense fallback="Loading images...">
        <div className="w-full flex p-4 gap-8 justify-center items-center ">
          <Button
            className={`${
              !filterParam && "bg-[#E0E7FF] text-black"
            } hover:text-white`}
          >
            <Link href="/gallery">All</Link>
          </Button>
          <Button
            className={`${
              filterParam === "remove-bg" && "bg-[#E0E7FF] text-black"
            } hover:text-white`}
          >
            <Link
              className="flex gap-3 items-center"
              href="/gallery?filter=remove-bg"
            >
              <Eraser />
              Remove Background
            </Link>
          </Button>
          <Button
            className={`${
              filterParam === "face-swap" && "bg-[#E0E7FF] text-black"
            } hover:text-white`}
          >
            <Link
              className="flex gap-3 items-center"
              href="/gallery?filter=face-swap"
            >
              <ArrowLeftRight />
              Face Swap
            </Link>
          </Button>
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

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ImageSection, NoContent } from "@/components/YourImages";
// import { GetUserImages } from "@/utils/GetUserImagesFromDb";
// import Link from "next/link";
// import React from "react";

// const page = async ({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | string[] | undefined };
// }) => {
//   const paramValue = await searchParams;
//   console.log("paramValue: " + paramValue.filter);
//   // get params
//   // const userImages = await GetUserImagesFromDb(paramValue);
//   const userImages: any[] = await GetUserImages(paramValue);

//   return (
//     <div className="w-full min-h-screen">
//       <div className="w-full">
//         <div className="p-4 bg-muted">
//           <h4 className="font-medium">Recent Images</h4>
//         </div>
//         <Tabs
//           defaultValue={(paramValue.filter as string) || "face-swap"}
//           className="w-full mx-auto"
//         >
//           <TabsList className="flex items-center justify-center flex-col xl:flex-row lg:flex-row sm:flex-row mt-10 gap-2 p-1 mb-20">
//             <TabsTrigger value="remove-bg">
//               <Link href="?filter=remove-bg">Remove BG</Link>
//             </TabsTrigger>
//             <TabsTrigger value="face-swap">
//               <Link href="?filter=face-swap">Face Swap</Link>
//             </TabsTrigger>
//             <TabsTrigger value="enhance">
//               <Link href="?filter=enhance">Enhance</Link>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="remove-bg">
//             {userImages.length > 0 ? (
//               <ImageSection
//                 className="grid xl:grid-cols-3 sm:grid-cols-1 gap-8 overflow-auto p-8"
//                 images={userImages}
//                 title="Background Removed"
//               />
//             ) : (
//               <NoContent sectionName="Remove Background" />
//             )}
//           </TabsContent>

//           <TabsContent value="face-swap">
//             {userImages.length > 0 ? (
//               <ImageSection
//                 className="grid xl:grid-cols-3 sm:grid-cols-1 gap-8 overflow-auto p-8"
//                 images={userImages}
//                 title="Face Swapped"
//               />
//             ) : (
//               <NoContent sectionName="Face Swap" />
//             )}
//           </TabsContent>

//           <TabsContent value="enhance">
//             {userImages.length > 0 ? (
//               <ImageSection
//                 className="grid xl:grid-cols-3 sm:grid-cols-1 gap-8 overflow-auto p-8"
//                 images={userImages}
//                 title="Enhanced"
//               />
//             ) : (
//               <NoContent sectionName="Enhance Image" />
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//       {/* <ImageSection images={userImages} title="Background Removed" /> */}
//     </div>
//   );
// };

// export default page;
