import { db } from "@/database";
import { userImages } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { Session } from "next-auth";

export const DeleteImage = async (session: Session, imageUrl: string) => {
  if (!session) {
    throw new Error("User not authenticated");
  }
  const query = await db
    .delete(userImages)
    .where(
      and(
        eq(userImages.userId, session.user.id),
        eq(userImages.imgUrl, imageUrl)
      )
    )
    .returning();
  if (!query.length) {
    throw new Error(
      "Image not found or you don't have permission to delete it"
    );
  }
  return query[0];
};
