import { useImageStore } from "@/store/useImageSelectionStore";

export const downloadImage = async () => {
  try {
    const imageUrl = useImageStore.getState().imageUrl;

    const res = await fetch(`/api/download?query=${imageUrl}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Could not download image" + res);
    }
    // Get content type and determine extension
    const contentType = res.headers.get("Content-Type") || "image/png";
    const extension =
      contentType === "image/jpeg"
        ? ".jpg"
        : contentType === "image/png"
        ? ".png"
        : contentType === "image/gif"
        ? ".gif"
        : ".png";
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ImagineAI-${Date.now()}${extension}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    return url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
