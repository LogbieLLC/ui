/**
 * Unified UI Framework Actions
 * 
 * Provides a single entry point for all framework actions through organized namespaces:
 * - ui.db: Database operations and schemas (Drizzle ORM)
 * - ui.auth: Authentication (client and server) (better-auth)
 * - ui.test: Testing utilities and helpers (Mocha)
 * - ui.next: Next.js framework integration
 * - ui.bun: Bun runtime detection and utilities
 * - ui.commands: Custom command system (plugin & registry)
 */

import * as dbNamespace from "./db";
import * as authNamespace from "./auth";
import * as testNamespace from "./test";
import * as nextNamespace from "./next";
import * as bunNamespace from "./bun";
import * as commandsNamespace from "./commands";

/**
 * Unified UI object that provides access to all framework actions
 */
export const ui = {
  /**
   * Database namespace (Drizzle ORM)
   * - db: Drizzle database instance
   * - schema: Database schemas
   */
  db: {
    ...dbNamespace,
  },

  /**
   * Authentication namespace (better-auth)
   * - Server: getSession, getCurrentUser
   * - Client: signIn, signUp, signOut, useSession
   * - Advanced: auth, authClient
   */
  auth: {
    ...authNamespace,
  },

  /**
   * Testing namespace (Mocha)
   * - Mocha utilities: describe, it, before, after, etc.
   * - Assert utilities
   * - Test setup/teardown helpers
   */
  test: {
    ...testNamespace,
  },

  /**
   * Next.js namespace (Base Framework)
   * - Core exports: Image, Link, useRouter, redirect, etc.
   * - Helpers: createMetadata, jsonResponse, errorResponse, etc.
   * - Utilities: getSearchParam, isServerComponent, etc.
   */
  next: {
    ...nextNamespace,
  },

  /**
   * Bun runtime namespace
   * - Runtime detection: isBun(), isNode(), getRuntime()
   * - Version info: getBunVersion(), getNodeVersion()
   * - Environment: getEnv(), isDevelopment(), isProduction()
   * - Conditional execution: ifBun(), ifNode()
   */
  bun: {
    ...bunNamespace,
  },

  /**
   * Custom commands namespace
   * - Simple registry: register(), execute()
   * - Plugin system: plugin()
   * - Utilities: list(), help(), has(), etc.
   */
  commands: {
    ...commandsNamespace,
  },
} as const;

// Re-export individual namespaces for convenience
export { dbNamespace as db };
export { authNamespace as auth };
export { testNamespace as test };
export { nextNamespace as next };
export { bunNamespace as bun };
export { commandsNamespace as commands };

// Export the type of the ui object
export type UI = typeof ui;
