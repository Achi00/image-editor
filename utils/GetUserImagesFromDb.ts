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
