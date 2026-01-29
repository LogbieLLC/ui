/**
 * Testing namespace for the UI framework
 * Provides access to test helpers and runner utilities
 */

// Re-export mocha utilities for convenience
export { describe, it, before, after, beforeEach, afterEach } from "mocha";

// Re-export assert for convenience
export { default as assert } from "assert";

// Note: Test setup/teardown in test/helpers/setup.ts runs automatically via mocha config
// No exports needed as it's executed globally before all tests
