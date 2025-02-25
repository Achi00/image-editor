import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

// export const GetUserById = unstable_cache(
//   (userId: string) => db.select().from(users).where(eq(users.id, userId)),
//   ["user-data"],
//   {
//     revalidate: 60 * 60 * 2,
//   }
// );
export const GetUserById = async (userId: string) => {
  const user = await db.select().from(users).where(eq(users.id, userId));
  return user;
};
