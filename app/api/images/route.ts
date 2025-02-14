import { db } from "@/database";
import { userImages } from "@/database/schema";
import { auth } from "@/lib/auth";
import { and, desc, eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
// get user images from database
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const filters = searchParams.get("filter")?.split(",") || [];

    // Validate allowed filters
    const validFilters = ["remove-bg", "face-swap", "enhance"];
    const sanitizedFilters = filters.filter((f) => validFilters.includes(f));

    const userId = session.user.id;

    const cachedData = await unstable_cache(
      async () => {
        return db
          .select()
          .from(userImages)
          .where(
            sanitizedFilters.length > 0
              ? and(
                  eq(userImages.userId, userId),
                  inArray(userImages.imageFrom, sanitizedFilters)
                )
              : eq(userImages.userId, userId)
          )
          .orderBy(desc(userImages.date))
          .limit(50);
      },
      [
        `user-images-${userId}`,
        `filters-${sanitizedFilters.sort().join("-")}`, // Include filters in cache key
      ],
      {
        tags: [
          `images-${userId}`,
          ...sanitizedFilters.map((f) => `filter-${f}-${userId}`), // Individual tags
        ],
        revalidate: 3600,
      }
    )();

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// upload user image urls to database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, imageFrom } = body;
    console.log("image url", imageUrl);
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const [newImage] = await db
      .insert(userImages)
      .values({
        userId: session.user.id,
        imgUrl: imageUrl,
        imageFrom: imageFrom,
        date: new Date(),
      })
      .returning();

    return NextResponse.json(newImage);
  } catch (error) {
    console.error("Database save error:", error);
    throw error;
  }
}
