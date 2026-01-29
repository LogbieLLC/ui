/**
 * Authentication namespace for the UI framework
 * Provides access to both client and server authentication functions
 */

// Server-side auth functions
export { getSession, getCurrentUser } from "@/lib/auth-server";

// Client-side auth functions
export { signIn, signUp, signOut, useSession } from "@/lib/auth-client";

// Re-export the main auth instance for advanced usage
export { auth } from "@/lib/auth";

// Re-export the authClient instance for direct client access
export { authClient } from "@/lib/auth-client";

// Re-export the Session type
export type { Session } from "@/lib/auth";
