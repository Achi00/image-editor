import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL as string;

const pool = neon(connectionString);

export const db = drizzle(pool);
