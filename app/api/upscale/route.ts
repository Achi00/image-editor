// import { db } from "@/database";
// import { users } from "@/database/schema";
// import { auth } from "@/lib/auth";
// import { GetUserById } from "@/utils/GetUserById";
// import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { GetUserById } from "@/utils/GetUserById";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

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

  // Upload to Vercel Blob and get temp image url
  const blob = await put((file as File).name, resizedImage, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
  });

  // process image upscale
  if (blob.url) {
    const input = {
      image: blob.url,
      // scale: 8,
      face_enhance: true,
    };
    try {
      const res = await replicate.run(
        "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
        { input }
      );

      const resultString = String(res);
      if (resultString) {
        // delete temp blob image from vercel/blob
        await del(blob.url, {
          token: process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
        });

        return Response.json({
          success: true,
          image: resultString,
        });
      }
      return Response.json({
        success: false,
        message: "Something went wrong",
      });
    } catch (error) {
      console.error(error);
      await del(blob.url, {
        token: process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN,
      });
      return Response.json({
        success: false,
        message:
          "This can happen if the generated image was flagged by safety filters",
      });
    }
  }

  return NextResponse.json({ url: blob.url });
}

// update user upscale processes after successful image upscaling
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    // chack if user exists
    const user = await GetUserById(userId);
    if (user) {
      // update user content
      // after successful image upscaling user will have -1 upscale
      const updatedUser = await db
        .update(users)
        .set({
          upscale: sql`${users.upscale} - 1`,
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser.length) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      return Response.json({
        success: true,
        remainingUpscale: updatedUser[0].upscale,
      });
    }
    return Response.json({
      success: false,
      message: "Couldn't find user",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
