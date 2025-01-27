import { FaceSwapResponse, FormFields } from "@/types";
import { uploadImage } from "@/utils/UploadImg";
import { useMutation } from "@tanstack/react-query";

// user image only recives single image and not array of data like FormFields prop
type FaceSwapInput = {
  user_image: File;
  generated_image_url: string;
};

// face swap and upload
export const useFaceSwap = () => {
  return useMutation({
    mutationFn: async (input: FaceSwapInput) => {
      // create FormData
      const formData = new FormData();
      console.log("user image: " + JSON.stringify(input.user_image));
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
        throw new Error(`Face swap failed: ${swapRes}`);
      }

      const swapData: FaceSwapResponse = await swapRes.json();

      // upload image to cloudinary
      const cloudinaryUrl = await uploadImage(swapData.result_image);

      return cloudinaryUrl;
    },
  });
};
