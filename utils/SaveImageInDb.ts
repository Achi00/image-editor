export const SaveImageInDb = async ({
  imageUrl,
  imageFrom,
}: {
  imageUrl: string;
  imageFrom: string;
}) => {
  try {
    const res = await fetch("/api/images", {
      method: "POST",
      body: JSON.stringify({
        imageUrl,
        imageFrom,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to save image");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Database save error:", error);
    throw error;
  }
};
