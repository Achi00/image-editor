import { db } from "@/database";
import { users } from "@/database/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select({ count: sql`count(*)` }).from(users);
    return Response.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Database test failed:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
