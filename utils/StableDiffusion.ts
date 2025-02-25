export const stableDiffusion = async ({
  prompt,
  negativePrompt,
}: {
  prompt: string;
  negativePrompt?: string;
}) => {
  try {
    const res = await fetch("/api/sd", {
      method: "POST",
      body: JSON.stringify({
        prompt,
        negativePrompt,
      }),
    });
    if (!res.ok) {
      throw new Error("failed to generate image");
    }
    const data = await res.json();
    console.log("Image URL:", data.image);
    const imageUrl = data.image;
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
  //   const input = {
  //     prompt: prompt,
  //     //   "A close-up, macro photography stock photo of a strawberry intricately sculpted into the shape of a hummingbird in mid-flight, its wings a blur as it sips nectar from a vibrant, tubular flower. The backdrop features a lush, colorful garden with a soft, bokeh effect, creating a dreamlike atmosphere. The image is exceptionally detailed and captured with a shallow depth of field, ensuring a razor-sharp focus on the strawberry-hummingbird and gentle fading of the background. The high resolution, professional photographers style, and soft lighting illuminate the scene in a very detailed manner, professional color grading amplifies the vibrant colors and creates an image with exceptional clarity. The depth of field makes the hummingbird and flower stand out starkly against the bokeh background.",
  //     negativePrompt: negativePrompt || "",
  //   };

  //   const output = await replicate.run("google/imagen-3", { input });

  //   console.log(output);
};
