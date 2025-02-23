import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const pool = neon(
  "postgresql://neondb_owner:npg_teWZB0zbYa1I@ep-sparkling-boat-a26syd2e-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
);

export const db = drizzle(pool);
