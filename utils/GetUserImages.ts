import { cookies } from "next/headers";

export const getUserImages = async () => {
  const cookieStore = await cookies();
  // Build a cookie header string by concatenating all cookies.
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch("http://localhost:3000/api/images", {
    headers: {
      cookie: cookieHeader,
    },
  });

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
