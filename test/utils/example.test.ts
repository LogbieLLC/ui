import { describe, it } from "mocha";
import assert from "assert";

// Example utility function to test
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

describe("Utility Functions", () => {
  describe("add", () => {
    it("should add two positive numbers", () => {
      assert.strictEqual(add(2, 3), 5);
    });

    it("should handle negative numbers", () => {
      assert.strictEqual(add(-1, 1), 0);
    });

    it("should handle zero", () => {
      assert.strictEqual(add(0, 5), 5);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      assert.strictEqual(multiply(2, 3), 6);
    });

    it("should handle zero", () => {
      assert.strictEqual(multiply(0, 5), 0);
    });
  });
});
