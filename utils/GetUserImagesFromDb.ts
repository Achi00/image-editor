import { db } from "@/database";
import { userImages } from "@/database/schema";
import { auth } from "@/lib/auth";
import { and, eq, inArray, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

export const GetUserImagesFromDb = async (paramValue: {
  [key: string]: string | string[] | undefined;
}) => {
  const cookieStore = await cookies();
  // get user cookies from browser
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // pass param value for filtering
  const filter = paramValue.filter;

  const response = await fetch(
    `http://localhost:3000/api/images?filter=${filter}`,
    {
      headers: {
        cookie: cookieHeader,
      },
    }
  );

  if (!response.ok) {
    // Optionally handle error responses here.
    const errorData = await response.json();
    throw new Error(
      `Failed to fetch images: ${errorData.error || response.statusText}`
    );
  }
  const images = await response.json();

  return images;
};

export const getAllUserImages = unstable_cache(
  async (session) => {
    return db
      .select()
      .from(userImages)
      .where(eq(userImages.userId, session.user.id))
      .orderBy(desc(userImages.date))
      .limit(50);
  },
  ["user-images"], // Single cache key
  {
    tags: [`images-${userImages.userId}`], // User-specific tag
    revalidate: 3600, // 1 hour cache
  }
);
