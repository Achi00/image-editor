import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryUrl = searchParams.get("query");

  if (!queryUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    // get image
    const imageResponse = await fetch(queryUrl);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    // Get content type and determine file extension
    const contentType =
      imageResponse.headers.get("Content-Type") || "image/png";
    const extension =
      contentType === "image/jpeg"
        ? ".jpg"
        : contentType === "image/png"
        ? ".png"
        : contentType === "image/gif"
        ? ".gif"
        : ".png";

    const filename = `imagineAI${Date.now()}${extension}`;

    // return blob
    const blob = await imageResponse.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Failed to download image", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
