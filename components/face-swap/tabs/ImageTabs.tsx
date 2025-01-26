"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateTab from "./GenerateTab";
import {
  useImageActions,
  useSelectedSourceId,
} from "@/store/useImageSelection";
import SelectImage from "../SelectImage";
import { galleryImages, imagesArr } from "@/lib/images";

// for source image
export default function ImageTabs() {
  const { setSelectedBackgroundSourceId } = useImageActions();
  const selectedSourceId = useSelectedSourceId();
  const [, setActiveTab] = useState("select");

  return (
    <Tabs
      defaultValue="select"
      className="w-full max-w-4xl mx-auto"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="generate">
          Generate with Stable Diffusion
        </TabsTrigger>
        <TabsTrigger value="select">Select Image</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <GenerateTab />
      </TabsContent>
      <TabsContent value="select">
        <SelectImage
          images={imagesArr}
          selectedId={selectedSourceId}
          onSelect={(id) => {
            setSelectedBackgroundSourceId(id);
          }}
        />
        {/* <SelectImage images={galleryImages} selectedId={selectedSourceId} /> */}
      </TabsContent>
    </Tabs>
  );
}
