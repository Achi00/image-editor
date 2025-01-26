// upload image to cloudinary
export const uploadImage = async (base64Image: string) => {
  try {
    const response = await fetch("/api/cloudinary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

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
