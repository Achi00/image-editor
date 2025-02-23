import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
  try {
    console.log("Starting migration...");

    await migrate(db, {
      migrationsFolder: "database/migrations",
    });

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);

    // More detailed error handling
    if (error instanceof Error) {
      if ("code" in error && error.code === "42P07") {
        console.log("Table already exists. This is likely because:");
        console.log("1. The migration has already been applied");
        console.log("2. You need to generate a new migration for your changes");
      } else {
        console.log("Detailed error:", error.message);
      }
    }

    process.exit(1);
  }
};

main();
