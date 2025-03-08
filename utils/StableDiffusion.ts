export const stableDiffusion = async ({
  prompt,
  negativePrompt,
  userId,
}: {
  prompt: string;
  negativePrompt?: string;
  userId: string;
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
      throw new Error(
        "failed to generate image, This can happen if the generated image was flagged by safety filters"
      );
    }
    let updatedData;
    const data = await res.json();
    console.log("data:", data);
    if (data.success) {
      try {
        // save image on cloudinary
        // update user's stable diffusion limit count, reduce by one
        const updateRes = await fetch("/api/sd", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Fix: Send userId as an object
        });

        if (!updateRes.ok) {
          throw new Error("Failed to update user generations");
        }

        updatedData = await updateRes.json();
      } catch (error) {
        console.error(error);
        return;
      }
      const resultImg = data.image;
      return { resultImg, updatedData };
    } else {
      return data.message;
    }
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
