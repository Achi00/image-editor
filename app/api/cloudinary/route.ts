import { v2 as cloudinary } from "cloudinary";

if (
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing Cloudinary credentials in environment variables");
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return Response.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${image}`,
      {
        resource_type: "image",
      }
    );

    return Response.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        error: "Failed to upload image",
      },
      { status: 500 }
    );
  }
}
