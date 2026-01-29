/**
 * Bun runtime namespace for the UI framework
 * Provides access to Bun runtime detection and utilities
 */

/**
 * Check if the code is running in Bun runtime
 */
export function isBun(): boolean {
  return typeof process !== "undefined" && "versions" in process && "bun" in process.versions;
}

/**
 * Check if the code is running in Node.js runtime
 */
export function isNode(): boolean {
  return typeof process !== "undefined" && "versions" in process && "node" in process.versions && !isBun();
}

/**
 * Get Bun version if running in Bun, otherwise null
 */
export function getBunVersion(): string | null {
  if (isBun() && process.versions.bun) {
    return process.versions.bun;
  }
  return null;
}

/**
 * Get Node.js version if running in Node.js, otherwise null
 */
export function getNodeVersion(): string | null {
  if (isNode() && process.versions.node) {
    return process.versions.node;
  }
  return null;
}

/**
 * Get current runtime name
 */
export function getRuntime(): "bun" | "node" | "unknown" {
  if (isBun()) {
    return "bun";
  }
  if (isNode()) {
    return "node";
  }
  return "unknown";
}

/**
 * Get runtime information object
 */
export function getRuntimeInfo(): {
  runtime: "bun" | "node" | "unknown";
  version: string | null;
  platform: string;
  arch: string;
} {
  return {
    runtime: getRuntime(),
    version: isBun() ? getBunVersion() : getNodeVersion(),
    platform: typeof process !== "undefined" ? process.platform : "unknown",
    arch: typeof process !== "undefined" ? process.arch : "unknown",
  };
}

/**
 * Get environment variable with optional default
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  if (typeof process === "undefined" || !process.env) {
    return defaultValue;
  }
  return process.env[key] ?? defaultValue;
}

/**
 * Get required environment variable (throws if not set)
 */
export function getRequiredEnv(key: string): string {
  const value = getEnv(key);
  if (value === undefined) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getEnv("NODE_ENV", "development") === "development";
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return getEnv("NODE_ENV", "development") === "production";
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return getEnv("NODE_ENV", "development") === "test";
}

/**
 * Execute a function only if running in Bun
 */
export function ifBun<T>(fn: () => T, fallback?: T): T | undefined {
  if (isBun()) {
    return fn();
  }
  return fallback;
}

/**
 * Execute a function only if running in Node.js
 */
export function ifNode<T>(fn: () => T, fallback?: T): T | undefined {
  if (isNode()) {
    return fn();
  }
  return fallback;
}
