/**
 * Database namespace for the UI framework
 * Provides access to database operations and schemas
 */

// Re-export the db instance
export { db } from "@/db";

// Re-export all schemas
export * as schema from "@/db/schema";
