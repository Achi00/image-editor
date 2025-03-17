import { db } from "@/database";
import { userImages } from "@/database/schema";
import { eq, desc, and } from "drizzle-orm";
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
    `${process.env.NEXTAUTH_URL}/api/images?filter=${filter}`,
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

// use unstable_cache for data caching
export const getAllUserImages = unstable_cache(
  async (session, filter) => {
    // initial condition for the user ID.
    let condition = eq(userImages.userId, session.user.id);

    // If a filter is provided, combine the conditions.
    if (filter) {
      condition = and(condition, eq(userImages.imageFrom, filter))!;
    }
    const query = db
      .select()
      .from(userImages)
      .where(condition)
      .orderBy(desc(userImages.date));

    return query;
  },

  [`user-images`],

  {
    tags: [`user-images`],
    revalidate: 3600,
  }
);
