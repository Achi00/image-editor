import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryUrl = searchParams.get("query");

  const filename = "imagineAI" + Date.now().toString();

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

    // return blob
    const blob = await imageResponse.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type":
          imageResponse.headers.get("Content-Type") || "image/jpeg",
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
