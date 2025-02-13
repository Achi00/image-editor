import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// console.log("Environment:", {
//   DATABASE_URL: process.env.DATABASE_URL,
//   NODE_ENV: process.env.NODE_ENV,
// });
// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not defined in environment variables");
// }

const pool = neon(process.env.DATABASE_URL!);
// const pool = neon(
//   "postgresql://neondb_owner:npg_teWZB0zbYa1I@ep-sparkling-boat-a26syd2e-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
// );

export const db = drizzle(pool);
