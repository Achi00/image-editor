import { AlertCircle, Images } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  useImageActions,
  useSelectedBackgroundSourceUrl,
} from "@/store/useImageSelectionStore";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@radix-ui/react-alert-dialog";

interface SdImageSelectedProps {
  isPending: boolean;
}

const SdImageSelected = ({ isPending }: SdImageSelectedProps) => {
  const { setSelectedBackgroundSourceUrl } = useImageActions();
  // Get the current URL value
  const backgroundUrl = useSelectedBackgroundSourceUrl();

  const handleRemove = () => {
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
            disabled={isPending}
            size="sm"
            onClick={handleRemove}
            className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            Remove
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                Show Image
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will remove your face swap result, but after
                  result image will stil be available in you{" "}
                  <span className="font-bold inline-flex gap-1 items-center">
                    Gallery <Images className="ml-1" />
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction
                  className="border bg-gray-800 text-white px-2 rounded-md font-semibold"
                  onClick={openModal}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
