import { FaceSwapResponse } from "@/types";
import { UploadImgCloudinary } from "@/utils/UploadImgCloudinary";
import { useMutation } from "@tanstack/react-query";
import { useErrorStore } from "@/store/useErrorStore";

// user image only recives single image and not array of data like FormFields prop
type FaceSwapInput = {
  user_image: File;
  generated_image_url: string;
};

// face swap and upload
export const useFaceSwap = () => {
  const setError = useErrorStore((state) => state.setError);
  return useMutation({
    mutationFn: async (input: FaceSwapInput) => {
      // create FormData
      const formData = new FormData();
      formData.append("user_image", input.user_image);
      formData.append("generated_image_url", input.generated_image_url);

      // face swap API
      const swapRes = await fetch(
        // "http://127.0.0.1:5000/swap-face",
        "https://face-swap-api.wordcrafter.io/swap-face",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!swapRes.ok) {
        setError("Something went wrong, Try another image");
        console.error("Face swap failed:", JSON.stringify(swapRes));
        return;
        // throw new Error(`Face swap failed: ${swapRes}`);
      }

      const swapData: FaceSwapResponse = await swapRes.json();

      // upload image to cloudinary
      const cloudinaryUrl = await UploadImgCloudinary(
        `data:image/jpeg;base64,${swapData.result_image}`
      );

      return cloudinaryUrl;
    },
  });
};
