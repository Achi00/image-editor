"use client";
import { Switch } from "@/components/ui/switch";
import { useCallback, useState } from "react";
import { Label } from "../ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import SelectImage from "./SelectImage";
import { galleryImages } from "@/lib/images";
import { Images } from "lucide-react";
import {
  useImageActions,
  useSelectedTargetId,
} from "@/store/useImageSelectionStore";

const GalleryToggle = () => {
  const [isGallerySelected, setIsGallerySelected] = useState(false);
  const selectedTargetId = useSelectedTargetId();
  const { setSelectedTargetFaceId } = useImageActions();

  const handleSelect = useCallback(
    (id: number) => {
      setSelectedTargetFaceId(id);
    },
    [setSelectedTargetFaceId]
  );
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isGallerySelected}
        id="gallery-toggle"
        onCheckedChange={(prev) => setIsGallerySelected(prev)}
      />
      <Label htmlFor="gallery-toggle">
        <h3 className="scroll-m-20 text-xl flex gap-2 items-center font-semibold tracking-tight">
          Open Gallery <Images />
        </h3>
      </Label>
      <Drawer
        open={isGallerySelected}
        onOpenChange={(open) => setIsGallerySelected(open)}
      >
        <DrawerContent>
          <div className="w-full flex flex-col max-h-[90vh] items-center overflow-auto">
            <DrawerHeader>
              <DrawerTitle>Select Target Face</DrawerTitle>
              <DrawerDescription>
                Selected image will be used as{" "}
                <span className="font-semibold">Target Face</span>
              </DrawerDescription>
            </DrawerHeader>
            {/* for target face images */}
            <SelectImage
              images={galleryImages}
              selectedId={selectedTargetId}
              onSelect={handleSelect}
            />

            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default GalleryToggle;
