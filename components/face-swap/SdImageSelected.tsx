import { AlertCircle } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  useImageActions,
  useSelectedBackgroundSourceUrl,
} from "@/store/useImageSelectionStore";
import { redirect } from "next/navigation";

const SdImageSelected = () => {
  const { setSelectedBackgroundSourceUrl } = useImageActions();
  // Get the current URL value
  const backgroundUrl = useSelectedBackgroundSourceUrl();

  const handleCancel = () => {
    setSelectedBackgroundSourceUrl(null);
  };

  const openModal = () => {
    console.log();
    redirect(`?modal=${backgroundUrl}`);
  };
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          <p className="text-sm font-medium text-blue-700">
            Stable Diffusion generated image selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            Remove
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openModal}
            className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            Show Image
          </Button>
        </div>
      </div>
      <div className="flex items-start space-x-2 text-sm text-blue-600">
        <p>
          Stable diffusion generated image is set as your source{" "}
          <span className="font-bold">Background</span> image, you can keep it
          or remove it by clicking remove button and select new one on{" "}
          <span className="font-bold">Select Image</span> tab below
        </p>
      </div>
    </div>
  );
};

export default SdImageSelected;
