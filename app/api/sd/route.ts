import { db } from "@/database";
import { users } from "@/database/schema";
import { auth } from "@/lib/auth";
import { GetUserById } from "@/utils/GetUserById";
import { eq, ne, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_KEY,
});

// generate image
export async function POST(req: Request) {
  const body = await req.json();
  const { prompt, negativePrompt } = body;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // check if user have stable diffusion generations left
  const sdGeneration = await db
    .select({
      stableDiffusion: users.stableDiffusion,
    })
    .from(users)
    .where(eq(users.id, session?.user?.id));

  if (sdGeneration[0].stableDiffusion >= 1) {
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
  } else {
    console.log("You don't have any generations left");
    return NextResponse.json({
      success: false,
      message: "image generation limit reached",
    });
  }
}

// update user stable diffusion images left after successful image generation
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    // chack if user exists
    const user = await GetUserById(userId);
    if (user) {
      // update users content
      const updatedUser = await db
        .update(users)
        .set({
          stableDiffusion: sql`${users.stableDiffusion} - 1`,
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser.length) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      return Response.json({
        success: true,
        remainingGenerations: updatedUser[0].stableDiffusion,
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
