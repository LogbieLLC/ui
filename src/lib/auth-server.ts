import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Get the current session on the server side
 * Use this in Server Components, Server Actions, and API routes
 */
export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Get the current user on the server side
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
