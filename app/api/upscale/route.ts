// import { db } from "@/database";
// import { users } from "@/database/schema";
// import { auth } from "@/lib/auth";
// import { GetUserById } from "@/utils/GetUserById";
// import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { put, del } from "@vercel/blob";
import sharp from "sharp";

const replicate = new Replicate({
  auth: process.env.REPLICATE_KEY,
});

// generate image
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  /* 
    resize image to 1024x1024 if it is larget than 1024x1024 otherwise small upscaled image will have bad quality
   */
  // get image as file buffer
  const fileBuffer = Buffer.from(await (file as File).arrayBuffer());
  // get image metadata
  const imageMetaData = await sharp(fileBuffer).metadata();
  // checking image size to decide if it needs to be 1024x1024 or now
  const resizedImage = sharp(fileBuffer);
  if ((imageMetaData.width || 0) > 1024 || (imageMetaData.height || 0) > 1024) {
    resizedImage.resize({ height: 1024, width: 1024, fit: "contain" });
  }
  console.log("resized image");

  // Upload to Vercel Blob and get temp image url
  const blob = await put((file as File).name, resizedImage, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
  });

  console.log("blob url: " + blob.url);

  // process image upscale
  if (blob.url) {
    const input = {
      image: blob.url,
      // scale: 8,
      face_enhance: true,
    };
    try {
      console.log("get image blob");
      console.log("upscaling image");
      console.log(input);
      const res = await replicate.run(
        "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
        { input }
      );

      const resultString = String(res);
      console.log("Result as string:", resultString);
      //
      if (resultString) {
        console.log("deleting blob...");
        // delete temp blob image from vercel/blob
        await del(blob.url, {
          token: process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
        });
        console.log(`Blob deleted: ${blob.url}`);

        return Response.json({
          success: true,
          image: resultString,
        });
      }
      return Response.json({
        success: false,
        image: "",
      });
    } catch (error) {
      console.error(error);
      return Response.json({
        success: false,
        message:
          "This can happen if the generated image was flagged by safety filters",
      });
    }
  }

  return NextResponse.json({ url: blob.url });
}
// export async function POST(req: Request) {
//   const body = await req.json();
//   const { imgBlob } = body;
//   const session = await auth();

//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // create temp image url
//   const imgUrl = imgBlob;

//   // check if user have stable diffusion generations left
//   const sdGeneration = await db
//     .select({
//       stableDiffusion: users.stableDiffusion,
//     })
//     .from(users)
//     .where(eq(users.id, session?.user?.id));

//   if (sdGeneration[0].stableDiffusion >= 1) {
//     const input = {
//       image: imgUrl,
//       scale: 8,
//       face_enhance: true,
//     };

//     try {
//       const res = await replicate.run(
//         "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
//         { input }
//       );

//       const resultString = String(res);
//       console.log("Result as string:", resultString);

//       return Response.json({
//         success: true,
//         image: resultString,
//       });
//     } catch (error) {
//       console.error(error);
//       return Response.json({
//         success: false,
//         message:
//           "This can happen if the generated image was flagged by safety filters",
//       });
//     }
//   } else {
//     console.log("You don't have any generations left");
//     return NextResponse.json({
//       success: false,
//       message: "image generation limit reached",
//     });
//   }
// }
