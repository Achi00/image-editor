export const upscaleImage = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("/api/upscale", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(response);
      throw new Error("Upscaling failed " + response);
    }

    console.log(JSON.stringify(response));

    return response.json();
  } catch (error) {
    console.error(error);
  }
};
