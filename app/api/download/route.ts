import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const searchParams = request.nextUrl.searchParams;
  const queryUrl = searchParams.get("query");

  const filename = "face-swap.jpg" + Date.now().toString();

  console.log("imageUrl " + queryUrl);
  console.log("params " + params);
  //   console.log("slug " + slug);

  if (!queryUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    const imageResponse = await fetch(queryUrl);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

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
