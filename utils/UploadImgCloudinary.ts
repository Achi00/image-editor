// upload image to cloudinary
export const UploadImgCloudinary = async (imageData: string) => {
  try {
    const response = await fetch("/api/cloudinary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to upload");
    }

    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
