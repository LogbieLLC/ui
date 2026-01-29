/**
 * Functional tests for UI Framework features
 * Tests the actual functionality of ui.next, ui.bun, and ui.commands
 */

import { describe, it, before, after, beforeEach } from "mocha";
import assert from "assert";

// Import individual namespaces with explicit .ts extension for ts-node
// Note: next.ts requires Next.js runtime, so we'll test it separately
import * as bunNamespace from "../src/ui/bun.ts";
import * as commandsNamespace from "../src/ui/commands.ts";

// Create ui object for testing (without next for now due to Next.js runtime requirements)
const ui = {
  bun: bunNamespace,
  commands: commandsNamespace,
} as any;

describe("UI Framework Functional Tests", () => {
  describe("ui.bun - Bun Runtime Detection", () => {
    it("should detect runtime type", () => {
      const runtime = ui.bun.getRuntime();
      assert.ok(["bun", "node", "unknown"].includes(runtime), "Should return valid runtime type");
    });

    it("should check if running in Bun", () => {
      const isBun = ui.bun.isBun();
      assert.strictEqual(typeof isBun, "boolean", "isBun() should return boolean");
    });

    it("should check if running in Node.js", () => {
      const isNode = ui.bun.isNode();
      assert.strictEqual(typeof isNode, "boolean", "isNode() should return boolean");
    });

    it("should get runtime info", () => {
      const info = ui.bun.getRuntimeInfo();
      assert.ok(info, "getRuntimeInfo() should return an object");
      assert.ok(["bun", "node", "unknown"].includes(info.runtime), "Should have valid runtime");
      assert.strictEqual(typeof info.platform, "string", "Should have platform string");
      assert.strictEqual(typeof info.arch, "string", "Should have arch string");
    });

    it("should get environment variables", () => {
      const nodeEnv = ui.bun.getEnv("NODE_ENV", "test");
      assert.strictEqual(typeof nodeEnv, "string", "getEnv() should return string");
    });

    it("should check development mode", () => {
      const isDev = ui.bun.isDevelopment();
      assert.strictEqual(typeof isDev, "boolean", "isDevelopment() should return boolean");
    });

    it("should check production mode", () => {
      const isProd = ui.bun.isProduction();
      assert.strictEqual(typeof isProd, "boolean", "isProduction() should return boolean");
    });

    it("should execute function conditionally for Bun", () => {
      const result = ui.bun.ifBun(() => "bun-result", "fallback");
      assert.ok(result !== undefined, "ifBun() should return a value");
    });

    it("should execute function conditionally for Node", () => {
      const result = ui.bun.ifNode(() => "node-result", "fallback");
      assert.ok(result !== undefined, "ifNode() should return a value");
    });
  });

  describe("ui.commands - Command System", () => {
    beforeEach(() => {
      // Clear commands before each test
      ui.commands.clear();
    });

    it("should register a simple command", () => {
      ui.commands.register("test:hello", () => "Hello, World!");
      assert.ok(ui.commands.has("test:hello"), "Command should be registered");
    });

    it("should execute a registered command", async () => {
      ui.commands.register("test:add", (a: number, b: number) => a + b);
      const result = await ui.commands.execute<[number, number], number>("test:add", 5, 3);
      assert.strictEqual(result, 8, "Command should execute and return correct result");
    });

    it("should execute async command", async () => {
      ui.commands.register("test:async", async (value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return `Async: ${value}`;
      });
      const result = await ui.commands.execute<[string], string>("test:async", "test");
      assert.strictEqual(result, "Async: test", "Async command should work");
    });

    it("should register command with metadata", () => {
      ui.commands.register(
        "test:greet",
        (name: string) => `Hello, ${name}!`,
        {
          description: "Greets a person",
          usage: "test:greet <name>",
          examples: ["test:greet John", "test:greet Jane"],
        }
      );
      const metadata = ui.commands.getMetadata("test:greet");
      assert.ok(metadata, "Command should have metadata");
      assert.strictEqual(metadata?.description, "Greets a person");
      assert.ok(Array.isArray(metadata?.examples));
    });

    it("should register plugin with multiple commands", () => {
      ui.commands.plugin("math", {
        add: (a: number, b: number) => a + b,
        subtract: (a: number, b: number) => a - b,
        multiply: {
          handler: (a: number, b: number) => a * b,
          metadata: {
            description: "Multiply two numbers",
            usage: "math:multiply <a> <b>",
          },
        },
      });

      assert.ok(ui.commands.has("math:add"), "Plugin command math:add should exist");
      assert.ok(ui.commands.has("math:subtract"), "Plugin command math:subtract should exist");
      assert.ok(ui.commands.has("math:multiply"), "Plugin command math:multiply should exist");
    });

    it("should execute plugin commands", async () => {
      ui.commands.plugin("calc", {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
      });

      const sum = await ui.commands.execute<[number, number], number>("calc:add", 10, 20);
      const product = await ui.commands.execute<[number, number], number>("calc:multiply", 5, 4);

      assert.strictEqual(sum, 30, "Plugin add command should work");
      assert.strictEqual(product, 20, "Plugin multiply command should work");
    });

    it("should list all registered commands", () => {
      ui.commands.register("cmd1", () => "result1");
      ui.commands.register("cmd2", () => "result2");
      ui.commands.plugin("plugin1", {
        cmd3: () => "result3",
      });

      const commands = ui.commands.list();
      assert.ok(commands.includes("cmd1"), "Should include cmd1");
      assert.ok(commands.includes("cmd2"), "Should include cmd2");
      assert.ok(commands.includes("plugin1:cmd3"), "Should include plugin command");
    });

    it("should get all commands with metadata", () => {
      ui.commands.register("cmd1", () => "result1", { description: "Command 1" });
      ui.commands.register("cmd2", () => "result2");

      const all = ui.commands.getAll();
      assert.ok(Array.isArray(all), "getAll() should return array");
      assert.ok(all.some((c) => c.name === "cmd1" && c.metadata?.description === "Command 1"));
      assert.ok(all.some((c) => c.name === "cmd2"));
    });

    it("should provide help text for command", () => {
      ui.commands.register(
        "help:test",
        () => "test",
        {
          description: "Test command",
          usage: "help:test",
          examples: ["help:test"],
        }
      );

      const help = ui.commands.help("help:test");
      assert.ok(help.includes("help:test"), "Help should include command name");
      assert.ok(help.includes("Test command"), "Help should include description");
    });

    it("should provide help text for all commands", () => {
      ui.commands.register("cmd1", () => "result1", { description: "First command" });
      ui.commands.register("cmd2", () => "result2", { description: "Second command" });

      const help = ui.commands.help();
      assert.ok(help.includes("cmd1"), "Help should list all commands");
      assert.ok(help.includes("cmd2"), "Help should list all commands");
    });

    it("should unregister a command", () => {
      ui.commands.register("temp:cmd", () => "temp");
      assert.ok(ui.commands.has("temp:cmd"), "Command should exist");

      const removed = ui.commands.unregister("temp:cmd");
      assert.strictEqual(removed, true, "unregister() should return true");
      assert.strictEqual(ui.commands.has("temp:cmd"), false, "Command should be removed");
    });

    it("should throw error when executing non-existent command", async () => {
      try {
        await ui.commands.execute("nonexistent:command");
        assert.fail("Should throw error for non-existent command");
      } catch (error) {
        assert.ok(error instanceof Error, "Should throw Error");
        assert.ok(error.message.includes("not found"), "Error message should mention not found");
      }
    });

    it("should handle command errors gracefully", async () => {
      ui.commands.register("error:cmd", () => {
        throw new Error("Test error");
      });

      try {
        await ui.commands.execute("error:cmd");
        assert.fail("Should throw error");
      } catch (error) {
        assert.ok(error instanceof Error, "Should throw Error");
        assert.ok(error.message.includes("error:cmd"), "Error should mention command name");
      }
    });

    it("should clear all commands", () => {
      ui.commands.register("cmd1", () => "result1");
      ui.commands.register("cmd2", () => "result2");
      assert.strictEqual(ui.commands.list().length, 2, "Should have 2 commands");

      ui.commands.clear();
      assert.strictEqual(ui.commands.list().length, 0, "Should have no commands after clear");
    });
  });

  describe("ui.next - Next.js Helpers", () => {
    // Note: Next.js helpers require Next.js runtime environment
    // These tests are skipped in the test environment but would work in Next.js context
    it.skip("should create metadata object (requires Next.js runtime)", () => {
      // This test would work in a Next.js environment
    });

    it.skip("should create JSON response (requires Next.js runtime)", () => {
      // This test would work in a Next.js environment
    });
  });

  describe("UI Framework Integration", () => {
    it("should have tested namespaces in ui object", () => {
      assert.ok(ui.bun, "ui.bun should exist");
      assert.ok(ui.commands, "ui.commands should exist");
    });

    it("should allow chaining different namespaces", async () => {
      // Register a command that uses bun runtime detection
      ui.commands.register("runtime:info", () => {
        return ui.bun.getRuntimeInfo();
      });

      const info = await ui.commands.execute<[], ReturnType<typeof ui.bun.getRuntimeInfo>>("runtime:info");
      assert.ok(info.runtime, "Should get runtime info through command");
      assert.ok(["bun", "node", "unknown"].includes(info.runtime), "Should return valid runtime");
    });
  });
});
