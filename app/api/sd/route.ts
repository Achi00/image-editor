import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_KEY,
});

// generate image
export async function POST(req: Request) {
  const body = await req.json();
  const { prompt, negativePrompt } = body;

  const input = {
    prompt: prompt,
    negativePrompt: negativePrompt,
  };

  const res = await replicate.run("google/imagen-3", { input });

  const resultString = String(res);
  console.log("Result as string:", resultString);

  return Response.json({
    success: true,
    image: resultString,
  });
}

// update user stable diffusion images left after successful image generation
