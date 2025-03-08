import { SaveImageInDb } from "./SaveImageInDb";
import { UploadImgCloudinary } from "./UploadImgCloudinary";

export const upscaleImage = async ({
  image,
  userId,
}: {
  image: File | string;
  userId: string;
}) => {
  let fileToUpload: File;
  if (typeof image === "string") {
    // Extract filename from URL or default to 'image.jpg'
    const filename = image.split("/").pop()?.split("?")[0] || "image.jpg";
    const convertedFile = await urlToFile(image, filename);

    if (!convertedFile) {
      throw new Error("Failed to convert image URL to File");
    }

    fileToUpload = convertedFile;
  }
  // Handle File case
  else {
    fileToUpload = image;
  }
  try {
    const formData = new FormData();
    formData.append("image", fileToUpload);

    const response = await fetch("/api/upscale", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(response);
      throw new Error("Upscaling failed " + response);
    }
    let updatedData;

    const data = await response.json();
    if (!data.success) {
      // throw new Error(data.message || "Upscaling failed");
      return {
        success: false,
        error: data.message,
      };
    } else if (data.success) {
      // upload user image on cloudinary
      const cloudinaryImgUrl = await UploadImgCloudinary(data.image);
      if (!cloudinaryImgUrl) {
        throw new Error("Failed to upload upscaled image to cloudinary");
      }
      // save cloudinary image url in database under userId
      const savedImage = await SaveImageInDb({
        imageUrl: cloudinaryImgUrl,
        imageFrom: "upscale",
      });
      if (!savedImage) {
        throw new Error("failed to save cloudinary image into database");
      }
      // update user's upscale coint in database
      const updateRes = await fetch("/api/upscale", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // Fix: Send userId as an object
      });
      if (!updateRes.ok) {
        throw new Error("Failed to update upscale image count in database");
      }

      updatedData = await updateRes.json();
      // update database data if user authenticated save image in database update upscale generation count for user
      console.log("updatedData: " + JSON.stringify(updatedData));
      return {
        success: true,
        upscaledImageUrl: cloudinaryImgUrl,
        remainingUpscale: updatedData.remainingUpscale,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

// helper fucntion to handle url images
const urlToFile = async (
  url: string,
  filename: string
): Promise<File | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // Extract MIME type from response headers or default to 'image/jpeg'
    const mimeType = response.headers.get("content-type") || "image/jpeg";

    return new File([blob], filename, { type: mimeType });
  } catch (error) {
    console.error("Error converting URL to File:", error);
    return null;
  }
};
