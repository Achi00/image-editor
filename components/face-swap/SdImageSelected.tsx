import { AlertCircle } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useImageActions } from "@/store/useImageSelectionStore";

const SdImageSelected = () => {
  const { setSelectedBackgroundSourceUrl } = useImageActions();

  const handleCancel = () => {
    setSelectedBackgroundSourceUrl(null);
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-100"
        >
          Remove
        </Button>
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
